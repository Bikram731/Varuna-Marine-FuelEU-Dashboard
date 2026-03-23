import { PrismaClient } from '@prisma/client';
import { IBankingRepository } from '../../../core/ports/IRepositories';

// postgres implementation. banking data.
export class PrismaBankingRepository implements IBankingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // calculate net balance from ledger.
  async getBankedBalance(shipId: string): Promise<number> {
    const entries = await this.prisma.bankEntry.findMany({
      where: { shipId }
    });
    
    // sum all entries. positive = banked, negative = applied.
    const balance = entries.reduce((sum, entry) => sum + entry.amountGco2eq, 0);
    return Math.round(balance * 100) / 100;
  }

  // insert positive record.
  async bankSurplus(shipId: string, year: number, amount: number): Promise<void> {
    await this.prisma.bankEntry.create({
      data: { shipId, year, amountGco2eq: amount }
    });
  }

  // insert negative record.
  async applyDeficit(shipId: string, year: number, amount: number): Promise<void> {
    await this.prisma.bankEntry.create({
      // negative amount to deduct from total balance.
      data: { shipId, year, amountGco2eq: -Math.abs(amount) }
    });
  }
}