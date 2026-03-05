import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WalletService } from '../wallet.service.js';

describe('WalletService', () => {
  let service: WalletService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      wallet: {
        findUnique: vi.fn(),
      },
      transactions: {
        findMany: vi.fn(),
      },
    };

    service = new WalletService(prismaMock);
  });

  it('should return wallet balance', async () => {
    prismaMock.wallet.findUnique.mockResolvedValue({
      walletId: 'w1',
      brlBalance: 0,
      btcBalance: 0,
      ethBalance: 0,
    });

    const result = await service.getBalance('u1');

    expect(prismaMock.wallet.findUnique).toHaveBeenCalledWith({
      where: { userId: 'u1' },
      select: {
        walletId: true,
        brlBalance: true,
        btcBalance: true,
        ethBalance: true,
      },
    });

    expect(result).toEqual({
      walletId: 'w1',
      brlBalance: 0,
      btcBalance: 0,
      ethBalance: 0,
    });
  });

  it('should return paginated history', async () => {
    prismaMock.wallet.findUnique.mockResolvedValue({
      walletId: 'w1',
      userId: 'u1',
    });

    prismaMock.transactions.findMany.mockResolvedValue([
      {
        transactionId: '1',
        walletId: 'w1',
        type: 'DEPOSIT',
        token: 'BTC',
        amount: 100,
        previousBalance: 0,
        newBalance: 100,
        groupId: null,
        createdAt: new Date(),
      },
    ]);

    const result = await service.getExtract('u1', 1, 10);

    expect(prismaMock.wallet.findUnique).toHaveBeenCalledWith({
      where: { userId: 'u1' },
    });

    expect(prismaMock.transactions.findMany).toHaveBeenCalledWith({
      where: { walletId: 'w1' },
      orderBy: { createdAt: 'desc' },
    });

    expect(result.meta.total).toBe(1);
    expect(result.data.length).toBe(1);
  });
});
