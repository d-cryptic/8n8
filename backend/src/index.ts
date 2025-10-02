import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application, NextFunction, Request, Response } from "express";
import helmet from "helmet";

import ratelimiter from "./utils/ratelimiter";

import authRoutes from "./routes/auth";
import credentialRoutes from "./routes/credential";
import executionRoutes from "./routes/execution";
import webhookRoutes from "./routes/webhook";
import workflowRoutes from "./routes/workflow";

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || "3001", 10);

export const prisma: PrismaClient = new PrismaClient();

app.use(helmet());
app.use(ratelimiter);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/workflow", workflowRoutes);
app.use("/api/credential", credentialRoutes);
app.use("/api/webhook", webhookRoutes);
app.use("/api/execution", executionRoutes);

// Error handlers
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGERM", async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
