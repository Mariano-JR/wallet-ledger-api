import { Transactions } from '@prisma/client';

export function groupTransactions(transactions: Transactions[]) {
  const grouped = new Map<string, Transactions[]>();

  for (const tx of transactions) {
    const key = tx.groupId ?? tx.transactionId;

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }

    grouped.get(key)!.push(tx);
  }

  return grouped;
}
