import { IPoolRepository } from '../ports/IRepositories';
import { PoolAllocator, IPoolMemberInput, IPoolMemberResult } from './PoolAllocator';
import { ComplianceCalculator } from '../domain/ComplianceCalculator';
import { PrismaClient } from '@prisma/client';

// Quick Prisma instantiation to fetch the data
const prisma = new PrismaClient();

export class PoolingUseCases {
  constructor(private readonly poolRepo: IPoolRepository) {}

  async createPool(year: number, memberIds: string[]): Promise<IPoolMemberResult[]> {
    // 1. Fetch the actual ship data from the database using the IDs from the frontend
    const routes = await prisma.route.findMany({
      where: {
        year: year,
        routeId: { in: memberIds }
      }
    });

    if (routes.length === 0) {
      throw new Error("No matching routes found in the database for the provided IDs.");
    }

    // 2. Transform the raw database rows into the math objects your Allocator needs
    const membersInput: IPoolMemberInput[] = routes.map(route => {
      // Use your existing domain logic to calculate the exact balance!
      const compliance = ComplianceCalculator.calculateCB(route as any);
      
      return {
        shipId: route.routeId,
        cbBefore: compliance.complianceBalance
      };
    });

    // 3. Feed the calculated math objects into your greedy algorithm
    const allocatedMembers = PoolAllocator.allocate(membersInput);

    // 4. Persist the results to the database
    await this.poolRepo.createPool(year, allocatedMembers);

    return allocatedMembers;
  }
}