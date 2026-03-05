import { Injectable } from '@nestjs/common';
import { CoingeckoService } from '../common/providers/coingecko.service.js';
import { SwapDto } from './dto/swap.dto.js';
import { AppError } from '../common/errors/app.error.js';
import { calculateSwap, SwapCalculation } from './domain/swap.calculator.js';
import { PrismaService } from '../prisma.service.js';
import { Prisma } from '@prisma/client';
import { WalletService } from '../wallet/wallet.service.js';
import { PrismaClient } from '@prisma/client/extension';
import { v4 as uuid, UUIDTypes } from 'uuid';

@Injectable()
export class SwapService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletService: WalletService,
    private readonly coingeckoService: CoingeckoService,
  ) {}

  async getQuote(data: SwapDto) {
    const price = await this.coingeckoService.getPrice(
      data.tokenIn,
      data.tokenOut,
    );

    if (!price) {
      throw new AppError('Token não suportado', 400);
    }

    const calculatedValues = calculateSwap(price, data.amount);

    const response = {
      quantidadeDeDestinoEstimada: calculatedValues.finalValue,
      taxaDeConversao: calculatedValues.feeRate,
      cotacaoUsada: new Date().toISOString(),
    };

    return response;
  }

  async swap(userId: string, data: SwapDto) {
    const price = await this.coingeckoService.getPrice(
      data.tokenIn,
      data.tokenOut,
    );

    if (!price) {
      throw new AppError('Token não suportado', 400);
    }

    const calculatedValues = calculateSwap(price, data.amount);

    const groupId = uuid();

    return (
      this.prisma.$transaction(async (tx) => {
        await this.swapOut(tx, userId, groupId, data);
        await this.swapFee(tx, userId, groupId, data, calculatedValues);
        await this.swapIn(tx, userId, groupId, data, calculatedValues);
      }),
      {
        message: 'Conversão concluida com sucesso',
      }
    );
  }

  private async swapOut(
    tx: PrismaClient,
    userId: string,
    groupId: string,
    data: SwapDto,
  ) {
    const coinBalance = await this.walletService.getCoinBalance(
      userId,
      data.tokenOut,
    );

    const amount = new Prisma.Decimal(data.amount);

    if (!coinBalance.coinToken.balance.gte(amount)) {
      throw new AppError('Saldo da carteira insuficiente');
    }

    const newBalance = coinBalance.coinToken.balance.minus(amount);

    (await tx.wallet.update({
      where: { walletId: coinBalance.wallet },
      data: {
        [coinBalance.coinToken.type]: {
          decrement: amount,
        },
      },
    }),
      await tx.transactions.create({
        data: {
          walletId: coinBalance.wallet,
          groupId,
          amount,
          token: data.tokenOut,
          type: 'SWAP_OUT',
          previousBalance: coinBalance.coinToken.balance,
          newBalance,
        },
      }));
  }

  private async swapFee(
    tx: PrismaClient,
    userId: string,
    groupId: string,
    data: SwapDto,
    calculatedValues: SwapCalculation,
  ) {
    const coinBalance = await this.walletService.getCoinBalance(
      userId,
      data.tokenIn,
    );

    const amount = new Prisma.Decimal(calculatedValues.feeValue);
    const newBalance = coinBalance.coinToken.balance.minus(amount);

    (await tx.wallet.update({
      where: { walletId: coinBalance.wallet },
      data: {
        [coinBalance.coinToken.type]: {
          decrement: amount,
        },
      },
    }),
      await tx.transactions.create({
        data: {
          walletId: coinBalance.wallet,
          groupId,
          amount,
          token: data.tokenIn,
          type: 'SWAP_FEE',
          previousBalance: coinBalance.coinToken.balance,
          newBalance,
        },
      }));
  }

  private async swapIn(
    tx: PrismaClient,
    userId: string,
    groupId: string,
    data: SwapDto,
    calculatedValues: SwapCalculation,
  ) {
    const coinBalance = await this.walletService.getCoinBalance(
      userId,
      data.tokenIn,
    );

    const amount = new Prisma.Decimal(calculatedValues.grossValue);
    const newBalance = coinBalance.coinToken.balance.plus(amount);

    (await tx.wallet.update({
      where: { walletId: coinBalance.wallet },
      data: {
        [coinBalance.coinToken.type]: {
          increment: amount,
        },
      },
    }),
      await tx.transactions.create({
        data: {
          walletId: coinBalance.wallet,
          groupId,
          amount,
          token: data.tokenIn,
          type: 'SWAP_IN',
          previousBalance: coinBalance.coinToken.balance,
          newBalance,
        },
      }));
  }
}
