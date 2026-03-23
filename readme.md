# Varuna Marine - FuelEU Compliance Dashboard

## 🌊 Overview
A professional-grade full-stack dashboard built to monitor vessel GHG intensity and manage FuelEU compliance. It features hexagonal architecture, automated pooling allocation, and compliance banking.

## 🏗️ Architecture Summary (Hexagonal Structure)
The project follows **Hexagonal Architecture (Ports & Adapters)** to decouple business logic from infrastructure:
- **Core (Domain/Application)**: Pure TypeScript logic for FuelEU math and greedy pooling algorithms.
- **Adapters (Inbound)**: Express.js controllers handling HTTP requests.
- **Adapters (Outbound)**: Prisma ORM for PostgreSQL persistence.

## 🚀 Setup & Run Instructions
1. **Database**: Create a PostgreSQL database named `varuna_db` on port `5433`.
2. **Backend**: 
   - `cd backend && npm install`
   - `npx prisma db push`
   - `npm run dev`
3. **Frontend**:
   - `cd frontend && npm install`
   - `npm run dev`

## 🧪 How to Execute Tests
- Run `npm test` in the `/backend` directory to execute Vitest unit tests for the compliance calculators.

## 📸 Sample Request/Response
**GET** `/routes/comparison`
**Response**: `[{ "routeId": "R001", "isCompliant": false, "percentDiff": 1.86 }]`