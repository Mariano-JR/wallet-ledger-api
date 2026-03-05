import { ApiProperty } from '@nestjs/swagger';
import type { Transactions, Wallet } from '@prisma/client';

export class DepositResponseDto {
  @ApiProperty({
    example: {
      walletId: 'uuid-string',
      userId: 'uuid-string',
      brlBalance: 1000,
      btcBalance: 0.101652,
      ethBalance: 0.435,
    },
  })
  wallet!: Wallet;

  @ApiProperty({
    example: {
      transactionId: 'uuid-string',
      walletId: 'uuid-string',
      idempotencyKey: 'uuid-string',
      groupId: 'uuid-string',
      type: 'DEPOSIT',
      token: 'BRL',
      amount: 100000,
      previusBalance: 0,
      newBalance: 100000,
      createAt: '2026-03-04T22:40:17.034Z',
    },
  })
  transaction!: Transactions;
}
