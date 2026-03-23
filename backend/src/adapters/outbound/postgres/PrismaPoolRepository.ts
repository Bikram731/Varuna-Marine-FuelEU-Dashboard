import { PrismaClient } from '@prisma/client';
import { IPoolRepository } from '../../../core/ports/IRepositories';

// postgres implementation. pool registry.
export class PrismaPoolRepository implements IPoolRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // atomic transaction. create pool and members.
  async createPool(year: number, members: { shipId: string, cbBefore: number, cbAfter: number }[]): Promise<string> {
    const pool = await this.prisma.pool.create({
      data: {
        year,
        members: {
          create: members.map(m => ({
            shipId: m.shipId,
            cbBefore: m.cbBefore,
            cbAfter: m.cbAfter
          }))
        }
      }
    });
    return pool.id;
  }
}