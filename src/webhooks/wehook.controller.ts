import { Body, Controller, Post } from '@nestjs/common';
import { WalletService } from '../wallet/wallet.service.js';
import { DepositDto } from './dto/deposit.dto.js';
import { v4 as uuid } from 'uuid';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DepositResponseDto } from './dto/deposit.response.dto.js';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebHooksController {
  constructor(private walletService: WalletService) {}

  @Post('deposit')
  @ApiOperation({ summary: 'Realiza deposito de saldo em carteira' })
  @ApiResponse({
    status: 200,
    description: 'Webhook Validado',
    type: DepositResponseDto,
  })
  async deposit(@Body() data: DepositDto) {
    const transactionData = {
      userId: data.userId,
      token: data.token,
      amount: data.amount,
      idempotencyKey: data.idempotencyKey || uuid(),
    };
    return this.walletService.processDeposit(transactionData);
  }
}
