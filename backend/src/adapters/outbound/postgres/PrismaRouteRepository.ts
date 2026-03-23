import { PrismaClient } from '@prisma/client';
import { IRouteRepository } from '../../../core/ports/IRepositories';
import { IRoute, VesselType, FuelType } from '../../../core/domain/types';

// route repository implementation. postgres adapter.
export class PrismaRouteRepository implements IRouteRepository {
  
  // dependency injection. prisma client.
  constructor(private readonly prisma: PrismaClient) {}

  // fetch all. map domain.
  async findAll(): Promise<IRoute[]> {
    const data = await this.prisma.route.findMany();
    return data.map(this.toDomain);
  }

  // fetch ID. handle null.
  async findById(id: string): Promise<IRoute | null> {
    const route = await this.prisma.route.findUnique({ where: { id } });
    return route ? this.toDomain(route) : null;
  }

  // atomic transaction. unset old, set new baseline. 
  async setBaseline(id: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.route.updateMany({
        where: { isBaseline: true },
        data: { isBaseline: false }
      }),
      this.prisma.route.update({
        where: { id },
        data: { isBaseline: true }
      })
    ]);
  }

  // fetch active baseline.
  async getBaseline(): Promise<IRoute | null> {
    const route = await this.prisma.route.findFirst({
      where: { isBaseline: true }
    });
    return route ? this.toDomain(route) : null;
  }

  // mapper. ORM entity -> pure domain entity.
  private toDomain(raw: any): IRoute {
    return {
      id: raw.id,
      routeId: raw.routeId,
      vesselType: raw.vesselType as VesselType,
      fuelType: raw.fuelType as FuelType,
      year: raw.year,
      ghgIntensity: raw.ghgIntensity,
      fuelConsumption: raw.fuelConsumption,
      distance: raw.distance,
      totalEmissions: raw.totalEmissions,
      isBaseline: raw.isBaseline
    };
  }
}