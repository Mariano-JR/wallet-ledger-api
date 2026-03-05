import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { DepositDto } from '../webhooks/dto/deposit.dto.js';
import { AppError } from '../common/errors/app.error.js';
import { Tokens } from '../common/enums/token.enum.js';
import { WithdrawDto } from './dto/withdraw.dto.js';
import { Prisma } from '@prisma/client';
import { groupTransactions } from './helpers/history/group-transactions.helper.js';
import { mapToHistory } from './helpers/history/map-to-history.helper.js';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async getBalance(userId: string) {
    return this.prisma.wallet.findUnique({
      where: { userId },
      select: {
        walletId: true,
        brlBalance: true,
        btcBalance: true,
        ethBalance: true,
      },
    });
  }

  async getExtract(userId: string, page: number, limit: number) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new AppError('Carteira não encontrada', 404);
    }

    const transactions = await this.prisma.transactions.findMany({
      where: { walletId: wallet.walletId },
      orderBy: { createdAt: 'desc' },
    });

    const grouped = groupTransactions(transactions);
    const history = mapToHistory(grouped);

    const start = (page - 1) * limit;
    const end = start + limit;

    const paginated = history.slice(start, end);

    return {
      data: paginated,
      meta: {
        total: history.length,
        page,
        lastPage: Math.ceil(history.length / limit),
      },
    };
  }

  async getCoinBalance(userId: string, token: Tokens) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new AppError('Carteira não encontrada', 404);
    }

    const coinToken = {
      BRL: {
        balance: wallet.brlBalance,
        type: 'brlBalance',
      },
      BTC: {
        balance: wallet.btcBalance,
        type: 'btcBalance',
      },
      ETH: {
        balance: wallet.ethBalance,
        type: 'ethBalance',
      },
    }[token];

    return {
      wallet: wallet.walletId,
      coinToken,
    };
  }

  async processDeposit(data: DepositDto) {
    const user = await this.prisma.user.findUnique({
      where: { userId: data.userId },
    });

    if (!user || !(data.token in Tokens)) {
      throw new AppError('Usuario ou token inválido', 401);
    }

    const existing = await this.prisma.transactions.findUnique({
      where: {
        idempotencyKey: data.idempotencyKey,
      },
    });

    if (existing) {
      return existing;
    }

    const amount = new Prisma.Decimal(data.amount);
    const coinBalance = await this.getCoinBalance(user.userId, data.token);
    const newBalance = coinBalance.coinToken.balance.plus(amount);

    return this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { walletId: coinBalance.wallet },
        data: {
          [coinBalance.coinToken.type]: {
            increment: amount,
          },
        },
      }),

      this.prisma.transactions.create({
        data: {
          walletId: coinBalance.wallet,
          amount: amount,
          token: data.token,
          type: 'DEPOSIT',
          idempotencyKey: data.idempotencyKey,
          previousBalance: coinBalance.coinToken.balance,
          newBalance,
        },
      }),
    ]);
  }

  async withdraw(userId: string, data: WithdrawDto) {
    const user = await this.prisma.user.findUnique({
      where: { userId },
    });

    if (!user || !(data.token in Tokens)) {
      throw new AppError('Usuario ou token inválido', 401);
    }

    const existing = await this.prisma.transactions.findUnique({
      where: {
        idempotencyKey: data.idempotencyKey,
      },
    });

    if (existing) {
      return existing;
    }

    const amount = new Prisma.Decimal(data.amount);
    const coinBalance = await this.getCoinBalance(user.userId, data.token);

    if (!coinBalance.coinToken.balance.gte(amount)) {
      throw new AppError('Saldo da carteira insuficiente');
    }

    const newBalance = coinBalance.coinToken.balance.minus(amount);

    return this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { walletId: coinBalance.wallet },
        data: {
          [coinBalance.coinToken.type]: {
            decrement: amount,
          },
        },
      }),

      this.prisma.transactions.create({
        data: {
          walletId: coinBalance.wallet,
          amount,
          token: data.token,
          type: 'WITHDRAWAL',
          idempotencyKey: data.idempotencyKey,
          previousBalance: coinBalance.coinToken.balance,
          newBalance,
        },
      }),
    ]);
  }
}
