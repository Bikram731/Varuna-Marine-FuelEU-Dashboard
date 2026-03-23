import { Request, Response } from 'express';
import { BankingUseCases } from '../../../core/application/BankingUseCases';

// express controller. banking endpoints.
export class BankingController {
  constructor(private readonly bankingUseCases: BankingUseCases) {}

  // GET /banking/records?shipId=...
  getRecords = async (req: Request, res: Response): Promise<void> => {
    try {
      const shipId = req.query.shipId as string;
      if (!shipId) throw new Error("shipId query parameter required.");
      
      const balance = await this.bankingUseCases.getBalance(shipId);
      res.status(200).json({ success: true, balance });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  // POST /banking/bank
  bankSurplus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipId, year, amount } = req.body;
      await this.bankingUseCases.bankSurplus(shipId, year, amount);
      res.status(200).json({ success: true, message: "Surplus banked successfully." });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  // POST /banking/apply
  applyDeficit = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipId, year, amount } = req.body;
      await this.bankingUseCases.applyDeficit(shipId, year, amount);
      res.status(200).json({ success: true, message: "Surplus applied to deficit." });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
}