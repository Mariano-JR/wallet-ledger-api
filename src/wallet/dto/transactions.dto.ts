import z from 'zod';
import { Tokens } from '../../common/enums/token.enum.js';
import { createZodDto } from 'nestjs-zod';

const TransactionHistoryItemSchema = z.object({
  id: z.string(),
  type: z.enum([
    'SWAP',
    'DEPOSIT',
    'WITHDRAWAL',
    'SWAP_IN',
    'SWAP_OUT',
    'SWAP_FEE',
  ]),

  tokenIn: z.enum(Tokens).optional(),
  tokenOut: z.enum(Tokens).optional(),

  amountIn: z.number().optional(),
  amountOut: z.number().optional(),

  fee: z.number().optional(),

  createdAt: z.date(),
});

export class TransactionsHistoryItemDto extends createZodDto(
  TransactionHistoryItemSchema,
) {}
