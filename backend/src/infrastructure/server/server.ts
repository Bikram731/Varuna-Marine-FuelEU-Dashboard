import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';



// imports. layers.
import { PrismaRouteRepository } from '../../adapters/outbound/postgres/PrismaRouteRepository';
import { RouteUseCases } from '../../core/application/RouteUseCases';
import { RouteController } from '../../adapters/inbound/http/RouteController';

import { PrismaPoolRepository } from '../../adapters/outbound/postgres/PrismaPoolRepository';
import { PoolingUseCases } from '../../core/application/PoolingUseCases';
import { PoolingController } from '../../adapters/inbound/http/PoolingController';

import { PrismaBankingRepository } from '../../adapters/outbound/postgres/PrismaBankingRepository';
import { BankingUseCases } from '../../core/application/BankingUseCases';
import { BankingController } from '../../adapters/inbound/http/BankingController';

// initialize express.
const app = express();
const PORT = process.env.PORT || 3000;

// middleware.
app.use(cors());
app.use(express.json());

// initialize database client.
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL as string
} as any);

// dependency injection wiring.
const routeRepo = new PrismaRouteRepository(prisma);
const routeUseCases = new RouteUseCases(routeRepo);
const routeController = new RouteController(routeUseCases);

const poolRepo = new PrismaPoolRepository(prisma);
const poolingUseCases = new PoolingUseCases(poolRepo);
const poolingController = new PoolingController(poolingUseCases);

const bankingRepo = new PrismaBankingRepository(prisma);
const bankingUseCases = new BankingUseCases(bankingRepo);
const bankingController = new BankingController(bankingUseCases);


//endpoints.
app.get('/routes', routeController.getAll);
app.post('/routes/:id/baseline', routeController.setBaseline);
app.get('/routes/comparison', routeController.getComparison);
app.get('/banking/records', bankingController.getRecords);
app.post('/banking/bank', bankingController.bankSurplus);
app.post('/banking/apply', bankingController.applyDeficit);
app.post('/pools', poolingController.createPool);

// health check.
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'live', db: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'live', db: 'disconnected' });
  }
});

// boot server.
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// graceful shutdown.
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});