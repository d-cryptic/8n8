import express, { NextFunction, Response } from "express";
import { body, validationResult } from "express-validator";
import { prisma } from "../index";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { executeWorkflowById } from "../services/workflowExecutor";

const router = express.Router();

router.use(authenticateToken);

router.post(
  "/",
  [
    body("title").trim().isLength({ min: 1, max: 100 }),
    body("nodes").isArray(),
    body("connections").isArray(),
    body("enabled").optional().isBoolean(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, nodes, connections, enabled = true } = req.body;

      const workflow = await prisma.workflow.create({
        data: {
          title,
          nodes,
          connections,
          enabled,
          userId: req.user!.id,
        },
        select: {
          id: true,
          title: true,
          enabled: true,
          nodes: true,
          connections: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.status(201).json({
        message: "Workflow created successfully",
        workflow,
      });
    } catch (error) {
      console.error("Create workflow error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

router.get("/", async (req: AuthRequest, res) => {
  try {
    const workflows = await prisma.workflow.findMany({
      where: { userId: req.user!.id },
      select: {
        id: true,
        title: true,
        enabled: true,
        nodes: true,
        connections: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            executions: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    res.json({ workflows });
  } catch (error) {
    console.error("Get workflows error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get specific workflow
router.get("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const workflow = await prisma.workflow.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
      select: {
        id: true,
        title: true,
        enabled: true,
        nodes: true,
        connections: true,
        createdAt: true,
        updatedAt: true,
        webhooks: {
          select: {
            id: true,
            title: true,
            method: true,
            path: true,
          },
        },
        executions: {
          select: {
            id: true,
            status: true,
            tasksDone: true,
            startedAt: true,
            completedAt: true,
          },
          orderBy: { startedAt: "desc" },
          take: 10,
        },
      },
    });

    if (!workflow) {
      return res.status(404).json({ error: "Workflow not found" });
    }

    res.json({ workflow });
  } catch (error) {
    console.error("Get workflow error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update workflow
router.put(
  "/:id",
  [
    body("title").optional().trim().isLength({ min: 1, max: 100 }),
    body("nodes").optional().isArray(),
    body("connections").optional().isArray(),
    body("enabled").optional().isBoolean(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const updateData = req.body;

      // Check if workflow exists and belongs to user
      const existingWorkflow = await prisma.workflow.findFirst({
        where: {
          id,
          userId: req.user!.id,
        },
      });

      if (!existingWorkflow) {
        return res.status(404).json({ error: "Workflow not found" });
      }

      const workflow = await prisma.workflow.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          title: true,
          enabled: true,
          nodes: true,
          connections: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.json({
        message: "Workflow updated successfully",
        workflow,
      });
    } catch (error) {
      console.error("Update workflow error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Delete workflow
router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Check if workflow exists and belongs to user
    const existingWorkflow = await prisma.workflow.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!existingWorkflow) {
      return res.status(404).json({ error: "Workflow not found" });
    }

    await prisma.workflow.delete({
      where: { id },
    });

    res.json({ message: "Workflow deleted successfully" });
  } catch (error) {
    console.error("Delete workflow error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Execute workflow (manual trigger)
router.post("/:id/execute", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const inputData = req.body.data || {};

    // Execute workflow using the workflow executor
    const executionId = await executeWorkflowById(id, req.user!.id, inputData);

    // Get the execution details
    const execution = await prisma.execution.findUnique({
      where: { id: executionId },
      select: {
        id: true,
        status: true,
        startedAt: true,
      },
    });

    res.json({
      message: "Workflow execution started",
      execution: {
        id: execution!.id,
        status: execution!.status,
        startedAt: execution!.startedAt,
      },
    });
  } catch (error: any) {
    console.error("Execute workflow error:", error);
    res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
});

export default router;
