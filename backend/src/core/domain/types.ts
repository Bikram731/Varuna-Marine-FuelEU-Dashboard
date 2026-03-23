export type VesselType = 'Container' | 'BulkCarrier' | 'Tanker' | 'RoRo';
export type FuelType = 'HFO' | 'LNG' | 'MGO';

export interface IRoute {
  readonly id: string; 
  routeId: string;
  vesselType: VesselType;
  fuelType: FuelType;
  year: number;
  ghgIntensity: number; 
  fuelConsumption: number; 
  distance: number; 
  totalEmissions: number; 
  isBaseline: boolean;
}

export interface IComplianceResult {
  shipId: string;
  year: number;
  energyInScope: number;
  complianceBalance: number;
  isCompliant: boolean;
}