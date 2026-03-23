import { IBankingRepository } from '../ports/IRepositories';

// banking application logic.
export class BankingUseCases {
  constructor(private readonly bankingRepo: IBankingRepository) {}

  // get banked balance.
  async getBalance(shipId: string): Promise<number> {
    return this.bankingRepo.getBankedBalance(shipId);
  }

  // bank positive surplus.
  async bankSurplus(shipId: string, year: number, amount: number): Promise<void> {
    if (amount <= 0) throw new Error("Bank amount must be positive.");
    await this.bankingRepo.bankSurplus(shipId, year, amount);
  }

  // apply banked surplus to deficit.
  async applyDeficit(shipId: string, year: number, amount: number): Promise<void> {
    if (amount <= 0) throw new Error("Apply amount must be positive.");
    
    // validate sufficient funds.
    const available = await this.getBalance(shipId);
    if (available < amount) {
      throw new Error(`Insufficient banked surplus. Available: ${available}`);
    }

    await this.bankingRepo.applyDeficit(shipId, year, amount);
  }
}