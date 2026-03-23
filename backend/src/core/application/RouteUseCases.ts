import { IRouteRepository } from '../ports/IRepositories';
import { ComplianceCalculator } from '../domain/ComplianceCalculator';
import { IRoute } from '../domain/types';

// comparison result dto.
export interface IComparisonResult {
  route: IRoute;
  percentDiff: number;
  isCompliant: boolean;
}

// route application logic. manager layer.
export class RouteUseCases {
  // inject repository.
  constructor(private readonly routeRepo: IRouteRepository) {}

  // fetch all.
  async getAllRoutes(): Promise<IRoute[]> {
    return this.routeRepo.findAll();
  }

  // set new baseline.
  async setBaseline(routeId: string): Promise<void> {
    await this.routeRepo.setBaseline(routeId);
  }

  // calculate baseline vs others.
  async getComparison(): Promise<IComparisonResult[]> {
    const baseline = await this.routeRepo.getBaseline();
    const allRoutes = await this.routeRepo.findAll();

    // handle missing baseline.
    if (!baseline) {
      throw new Error("Baseline route not set.");
    }

    // map routes. compute diffs.
    return allRoutes.map(route => {
      const percentDiff = ComplianceCalculator.calculatePercentDiff(
        baseline.ghgIntensity, 
        route.ghgIntensity
      );
      
      return {
        route,
        percentDiff,
        // Ensure ghgIntensity is passed as a number
        isCompliant: ComplianceCalculator.isCompliant(Number(route.ghgIntensity))
      };
    });
  }
}