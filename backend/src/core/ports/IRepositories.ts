import { IRoute } from '../domain/types';

export interface IRouteRepository {
  findAll(): Promise<IRoute[]>;
  findById(id: string): Promise<IRoute | null>;
  setBaseline(id: string): Promise<void>;
  getBaseline(): Promise<IRoute | null>;
}

export interface IBankingRepository {
  getBankedBalance(shipId: string): Promise<number>;
  bankSurplus(shipId: string, year: number, amount: number): Promise<void>;
  applyDeficit(shipId: string, year: number, amount: number): Promise<void>;
}

export interface IPoolRepository {
  createPool(year: number, members: { shipId: string, cbBefore: number, cbAfter: number }[]): Promise<string>;
}