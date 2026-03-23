# AI Agent Workflow Log

## 🤖 Agents Used
- Gemini 3 Flash (Primary Architect & Debugger)

## 💬 Prompts & Outputs
- **Example 1**: "Implement a greedy allocation algorithm for FuelEU pooling where surplus ships offset deficit ships." -> *Generated core pooling logic in TypeScript.*
- **Example 2**: "Fix Prisma P1001 connection error for custom port 5433." -> *Provided env configuration and URL encoding for passwords.*

## 🛠️ Validation / Corrections
I manually verified all compliance math against FuelEU 2025 targets (89.3368 gCO₂e/MJ). I corrected the agent when it attempted to use deprecated Prisma v5 syntax, forcing an update to Prisma v7 `datasourceUrl` standards.

## 📈 Observations
- **Time Saver**: Boilerplate for Express controllers and React Tailwind components.
- **Failure**: Agent hallucinated `datasources` property in Prisma v7 which required manual correction.
- **Effectiveness**: Best used for refactoring complex math into pure domain functions.

## ✅ Best Practices Followed
- Used granular prompts for Hexagonal layers.
- Verified AI-generated SQL/Prisma schemas against project requirements.