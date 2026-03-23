import { Request, Response } from 'express';
import { PoolingUseCases } from '../../../core/application/PoolingUseCases';

// express controller. pooling endpoints.
export class PoolingController {
  constructor(private readonly poolingUseCases: PoolingUseCases) {}

  // POST /pools
  createPool = async (req: Request, res: Response): Promise<void> => {
    try {
      const { year, members } = req.body;
      
      // strict validation.
      if (!year || !members || !Array.isArray(members)) {
        throw new Error("Invalid payload. 'year' and 'members' array required.");
      }

      // execute orchestration.
      const result = await this.poolingUseCases.createPool(year, members);
      
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
}