import { Request, Response } from 'express';
import { RouteUseCases } from '../../../core/application/RouteUseCases';

// express controller. route endpoints.
export class RouteController {
  // inject use cases.
  constructor(private readonly routeUseCases: RouteUseCases) {}

  // GET /routes
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const routes = await this.routeUseCases.getAllRoutes();
      res.status(200).json({ success: true, data: routes });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  // POST /routes/:id/baseline
  setBaseline = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.routeUseCases.setBaseline(id as string);
      res.status(200).json({ success: true, message: "Baseline updated." });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  // GET /routes/comparison
  getComparison = async (req: Request, res: Response): Promise<void> => {
    try {
      const comparison = await this.routeUseCases.getComparison();
      res.status(200).json({ success: true, data: comparison });
    } catch (error: any) {
      // 400 bad request if baseline missing.
      res.status(400).json({ success: false, error: error.message });
    }
  };
}
