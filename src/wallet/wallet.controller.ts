import { v4 as uuid } from 'uuid';
import type { Request } from 'express';
import { WalletService } from './wallet.service.js';
import { WithdrawDto } from './dto/withdraw.dto.js';
import { PaginationQueryDto } from './dto/pagination.query.dto.js';
import { GetBalanceResponseDto } from './dto/balance.response.dto.js';
import { Body, Controller, Get, Req, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Wallet')
@ApiBearerAuth()
@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get('balance')
  @ApiOperation({ summary: 'Busca saldos em carteira' })
  @ApiResponse({
    status: 200,
    description: 'Saldos da carteira retornados com sucesso',
    type: GetBalanceResponseDto,
  })
  balance(@Req() req: Request) {
    const userId = req.user!.sub;

    return this.walletService.getBalance(userId);
  }

  @Get('extract')
  @ApiOperation({ summary: 'Retorna extrado bancario' })
  @ApiResponse({
    status: 200,
    description: 'Extrato bancario retornado com sucesso',
    type: PaginationQueryDto,
  })
  async getLedger(
    @Req() req: Request,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const userId = req.user!.sub;

    return await this.walletService.getExtract(userId, page, limit);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Realiza saque de valores na carteira' })
  @ApiResponse({
    status: 200,
    description: 'Saque realizado com sucesso',
  })
  withdraw(@Req() req: Request, @Body() data: WithdrawDto) {
    const userId = req.user!.sub;

    const formatedData = {
      token: data.token,
      amount: data.amount,
      idempotencyKey: data.idempotencyKey || uuid(),
    };

    return this.walletService.withdraw(userId, formatedData);
  }
}
