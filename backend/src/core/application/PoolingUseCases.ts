import { IPoolRepository } from '../ports/IRepositories';
import { PoolAllocator, IPoolMemberInput, IPoolMemberResult } from './PoolAllocator';

// pooling application logic.
export class PoolingUseCases {
  constructor(private readonly poolRepo: IPoolRepository) {}

  // execute allocation. persist data.
  async createPool(year: number, membersInput: IPoolMemberInput[]): Promise<IPoolMemberResult[]> {
    // pure domain logic. greedy algorithm.
    const allocatedMembers = PoolAllocator.allocate(membersInput);

    // persist database transaction.
    await this.poolRepo.createPool(year, allocatedMembers);

    return allocatedMembers;
  }
}