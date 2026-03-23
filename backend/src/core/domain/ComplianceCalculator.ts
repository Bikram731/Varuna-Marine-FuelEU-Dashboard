import { IRoute, IComplianceResult } from './types';

export class ComplianceCalculator {
  public static readonly TARGET_INTENSITY = 89.3368; 
  private static readonly ENERGY_CONVERSION_FACTOR = 41000; 

  public static isCompliant(ghgIntensity: number): boolean {
    return ghgIntensity <= this.TARGET_INTENSITY;
  }

  public static getEnergyInScope(fuelConsumptionTons: number): number {
    return fuelConsumptionTons * this.ENERGY_CONVERSION_FACTOR;
  }

  public static calculateCB(route: IRoute): IComplianceResult {
    const energyInScope = this.getEnergyInScope(route.fuelConsumption);
    const balance = (this.TARGET_INTENSITY - route.ghgIntensity) * energyInScope;
    
    const roundedBalance = Math.round(balance * 100) / 100;

    return {
      shipId: route.routeId,
      year: route.year,
      energyInScope,
      complianceBalance: roundedBalance,
      isCompliant: roundedBalance >= 0
    };
  }

  public static calculatePercentDiff(baselineIntensity: number, comparisonIntensity: number): number {
    if (baselineIntensity === 0) return 0; 
    const diff = ((comparisonIntensity / baselineIntensity) - 1) * 100;
    return Math.round(diff * 100) / 100;
  }
}