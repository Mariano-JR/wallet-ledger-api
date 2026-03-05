import { ApiProperty } from '@nestjs/swagger';
import { Transactions } from '@prisma/client';

export class LedgerReponseDto {
  @ApiProperty({
    example: [
      {
        transactionId: 'uuid-string',
        walletId: 'uuid-string',
        idempotencyKey: null,
        groupId: 'uuid-string',
        type: 'SWAP_IN',
        token: 'BTC',
        amount: '0.1052',
        previousBalance: '0.101652',
        newBalance: '0.206852',
        createdAt: '2026-03-05T13:47:25.099Z',
      },
    ],
  })
  ledger!: Transactions[];
}
