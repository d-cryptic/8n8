import express, { NextFunction, Response } from "express";
import { body, validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../index";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { executeWorkflowById } from "../services/workflowExecutor";

const router = express.Router();

router.use((req, res, next) => {
  if (req.path.startsWith("/handler/")) {
    return next();
  }

  return authenticateToken(req, res, next);
});

router.post(
  "/",
  [
    body("title").trim().isLength({ min: 1, max: 100 }),
    body("method").isIn(["GET", "POST", "PUT", "DELETE", "PATCH"]),
    body("workflowId").isMongoId(),
    body("header").optional().trim(),
    body("secret").optional().trim(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, method, workflowId, header, secret } = req.body;

      const workflow = await prisma.workflow.findFirst({
        where: {
          id: workflowId,
          userId: req.user!.id,
        },
      });

      if (!workflow) {
        return res.status(404).json({ error: "Workflow not found" });
      }

      // Generate unique webhook path
      const webhookId = uuidv4();
      const path = `/webhook/handler/${webhookId}`;

      const webhook = await prisma.webhook.create({
        data: {
          title,
          method,
          path,
          header: header || null,
          secret: secret || null,
          workflowId,
          userId: req.user!.id,
        },
        select: {
          id: true,
          title: true,
          method: true,
          path: true,
          header: true,
          secret: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.status(201).json({
        message: "Webhook created successfully",
        webhook: {
          ...webhook,
          fullUrl: `${
            process.env.FRONTEND_URL || "http://localhost:3001"
          }${path}`,
        },
      });
    } catch (error) {
      console.error("Create webhook error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Get all webhooks for user
router.get("/", async (req: AuthRequest, res) => {
  try {
    const webhooks = await prisma.webhook.findMany({
      where: { userId: req.user!.id },
      select: {
        id: true,
        title: true,
        method: true,
        path: true,
        header: true,
        secret: true,
        createdAt: true,
        updatedAt: true,
        workflow: {
          select: {
            id: true,
            title: true,
            enabled: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const webhooksWithUrls = webhooks.map((webhook) => ({
      ...webhook,
      fullUrl: `${process.env.FRONTEND_URL || "http://localhost:3001"}${
        webhook.path
      }`,
    }));

    res.json({ webhooks: webhooksWithUrls });
  } catch (error) {
    console.error("Get webhooks error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get specific webhook
router.get("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const webhook = await prisma.webhook.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
      select: {
        id: true,
        title: true,
        method: true,
        path: true,
        header: true,
        secret: true,
        createdAt: true,
        updatedAt: true,
        workflow: {
          select: {
            id: true,
            title: true,
            enabled: true,
          },
        },
      },
    });

    if (!webhook) {
      return res.status(404).json({ error: "Webhook not found" });
    }

    res.json({
      webhook: {
        ...webhook,
        fullUrl: `${process.env.FRONTEND_URL || "http://localhost:3001"}${
          webhook.path
        }`,
      },
    });
  } catch (error) {
    console.error("Get webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update webhook
router.put(
  "/:id",
  [
    body("title").optional().trim().isLength({ min: 1, max: 100 }),
    body("method").optional().isIn(["GET", "POST", "PUT", "DELETE", "PATCH"]),
    body("header").optional().trim(),
    body("secret").optional().trim(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const updateData = req.body;

      // Check if webhook exists and belongs to user
      const existingWebhook = await prisma.webhook.findFirst({
        where: {
          id,
          userId: req.user!.id,
        },
      });

      if (!existingWebhook) {
        return res.status(404).json({ error: "Webhook not found" });
      }

      const webhook = await prisma.webhook.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          title: true,
          method: true,
          path: true,
          header: true,
          secret: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.json({
        message: "Webhook updated successfully",
        webhook: {
          ...webhook,
          fullUrl: `${process.env.FRONTEND_URL || "http://localhost:3001"}${
            webhook.path
          }`,
        },
      });
    } catch (error) {
      console.error("Update webhook error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const existingWebhook = await prisma.webhook.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!existingWebhook) {
      return res.status(404).json({ error: "Webhook not found" });
    }

    await prisma.webhook.delete({
      where: { id },
    });

    res.json({ message: "Webhook deleted successfully" });
  } catch (error) {
    console.error("Delete webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.all("/handler/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const method = req.method;
    const headers = req.headers;
    const body = req.body;

    // Find webhook by path
    const webhook = await prisma.webhook.findFirst({
      where: {
        path: `/webhook/handler/${id}`,
      },
      include: {
        workflow: true,
        user: true,
      },
    });

    if (!webhook) {
      return res.status(404).json({ error: "Webhook not found" });
    }

    // Check if method matches
    if (webhook.method !== method) {
      return res.status(405).json({ error: `Method ${method} not allowed` });
    }

    // Check if workflow is enabled
    if (!webhook.workflow.enabled) {
      return res.status(400).json({ error: "Workflow is disabled" });
    }

    // Verify webhook secret if provided
    if (webhook.secret) {
      const providedSecret =
        headers["x-webhook-secret"] || headers["webhook-secret"];
      if (providedSecret !== webhook.secret) {
        return res.status(401).json({ error: "Invalid webhook secret" });
      }
    }

    const webhookData = {
      method,
      headers,
      body,
      timestamp: new Date().toISOString(),
    };

    const executionId = await executeWorkflowById(
      webhook.workflowId,
      webhook.userId,
      webhookData,
    );

    res.json({
      message: "Webhook received successfully",
      executionId: executionId,
      status: "pending",
    });
  } catch (error) {
    console.error("Webhook handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
