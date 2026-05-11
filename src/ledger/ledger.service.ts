import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { AppError } from '../common/errors/app.error.js';

@Injectable()
export class LedgerService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, page: number, limit: number) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new AppError('Carteira não encontrada', 401);
    }

    return this.prisma.transactions.findMany({
      where: {
        walletId: wallet.walletId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: Number(limit),
    });
  }
}
