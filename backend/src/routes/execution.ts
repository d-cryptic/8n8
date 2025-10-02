import express, { NextFunction, Response } from "express";
import { prisma } from "../index";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.use(authenticateToken);

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, status, workflowId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      userId: req.user!.id,
    };

    if (status) {
      where.status = status;
    }

    if (workflowId) {
      where.workflowId = workflowId;
    }

    const [executions, total] = await Promise.all([
      prisma.execution.findMany({
        where,
        select: {
          id: true,
          status: true,
          tasksDone: true,
          startedAt: true,
          completedAt: true,
          error: true,
          workflow: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { startedAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.execution.count({ where }),
    ]);

    res.json({
      executions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get executions error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const execution = await prisma.execution.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
      select: {
        id: true,
        status: true,
        tasksDone: true,
        result: true,
        error: true,
        startedAt: true,
        completedAt: true,
        workflow: {
          select: {
            id: true,
            title: true,
            enabled: true,
          },
        },
      },
    });

    if (!execution) {
      return res.status(404).json({ error: "Execution not found" });
    }

    res.json({ execution });
  } catch (error) {
    console.error("Get execution error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/cancel", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const execution = await prisma.execution.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!execution) {
      return res.status(404).json({ error: "Execution not found" });
    }

    if (execution.status === "completed" || execution.status === "failed") {
      return res.status(400).json({ error: "Execution cannot be cancelled" });
    }

    const updatedExecution = await prisma.execution.update({
      where: { id },
      data: {
        status: "failed",
        error: "Cancelled by user",
        completedAt: new Date(),
      },
      select: {
        id: true,
        status: true,
        tasksDone: true,
        error: true,
        startedAt: true,
        completedAt: true,
      },
    });

    res.json({
      message: "Execution cancelled successfully",
      execution: updatedExecution,
    });
  } catch (error) {
    console.error("Cancel execution error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id/logs", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const execution = await prisma.execution.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
      select: {
        id: true,
        status: true,
        result: true,
        error: true,
        startedAt: true,
        completedAt: true,
      },
    });

    if (!execution) {
      return res.status(404).json({ error: "Execution not found" });
    }

    const logs = [
      {
        timestamp: execution.startedAt,
        level: "info",
        message: "Execution started",
      },
      ...(execution.completedAt
        ? [
            {
              timestamp: execution.completedAt,
              level: execution.status === "completed" ? "info" : "error",
              message:
                execution.status === "completed"
                  ? "Execution completed"
                  : `Execution failed: ${execution.error}`,
            },
          ]
        : []),
    ];

    res.json({ logs });
  } catch (error) {
    console.error("Get execution logs error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const execution = await prisma.execution.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!execution) {
      return res.status(404).json({ error: "Execution not found" });
    }

    await prisma.execution.delete({
      where: { id },
    });

    res.json({ message: "Execution deleted successfully" });
  } catch (error) {
    console.error("Delete execution error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
