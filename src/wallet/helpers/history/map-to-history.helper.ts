import { Transactions } from '@prisma/client';
import { TransactionsHistoryItemDto } from '../../dto/transactions.dto.js';
import { Tokens } from '../../../common/enums/token.enum.js';

export function mapToHistory(grouped: Map<string, Transactions[]>) {
  const history: TransactionsHistoryItemDto[] = [];

  for (const [, group] of grouped) {
    const first = group[0];

    if (group.length === 1) {
      history.push({
        id: first.transactionId,
        type: first.type,
        [first.type === 'DEPOSIT' ? 'toToken' : 'fromToken']: first.token,
        [first.type === 'DEPOSIT' ? 'amountIn' : 'amountOut']: first.amount,
        createdAt: first.createdAt,
      });
      continue;
    }

    const swapOut = group.find((t) => t.type === 'SWAP_OUT');
    const swapIn = group.find((t) => t.type === 'SWAP_IN');
    const fee = group.find((t) => t.type === 'SWAP_FEE');
    const groupId = first.groupId || ' ';

    history.push({
      id: groupId,
      type: 'SWAP',
      tokenIn: swapIn?.token as Tokens | undefined,
      amountIn: Number(swapIn?.amount),
      tokenOut: swapOut?.token as Tokens | undefined,
      amountOut: Number(swapOut?.amount),
      fee: Number(fee?.amount),
      createdAt: first.createdAt,
    });
  }

  return history;
}
