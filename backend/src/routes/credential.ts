import express, { NextFunction, Response } from "express";
import { body, validationResult } from "express-validator";
import { prisma } from "../index";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Create credential
router.post(
  "/",
  [
    body("title").trim().isLength({ min: 1, max: 100 }),
    body("platform").isIn(["telegram", "email", "webhook"]),
    body("data").isObject(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, platform, data } = req.body;

      // Validate platform-specific data
      if (platform === "telegram" && !data.botToken) {
        return res
          .status(400)
          .json({ error: "Bot token is required for Telegram credentials" });
      }

      if (platform === "email" && !data.apiKey) {
        return res
          .status(400)
          .json({ error: "API key is required for email credentials" });
      }

      const credential = await prisma.credential.create({
        data: {
          title,
          platform,
          data,
          userId: req.user!.id,
        },
        select: {
          id: true,
          title: true,
          platform: true,
          data: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.status(201).json({
        message: "Credential created successfully",
        credential,
      });
    } catch (error) {
      console.error("Create credential error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Get all credentials for user
router.get("/", async (req: AuthRequest, res) => {
  try {
    const credentials = await prisma.credential.findMany({
      where: { userId: req.user!.id },
      select: {
        id: true,
        title: true,
        platform: true,
        data: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    res.json({ credentials });
  } catch (error) {
    console.error("Get credentials error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get specific credential
router.get("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const credential = await prisma.credential.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
      select: {
        id: true,
        title: true,
        platform: true,
        data: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!credential) {
      return res.status(404).json({ error: "Credential not found" });
    }

    res.json({ credential });
  } catch (error) {
    console.error("Get credential error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update credential
router.put(
  "/:id",
  [
    body("title").optional().trim().isLength({ min: 1, max: 100 }),
    body("data").optional().isObject(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const updateData = req.body;

      // Check if credential exists and belongs to user
      const existingCredential = await prisma.credential.findFirst({
        where: {
          id,
          userId: req.user!.id,
        },
      });

      if (!existingCredential) {
        return res.status(404).json({ error: "Credential not found" });
      }

      // Validate platform-specific data if data is being updated
      if (updateData.data) {
        if (
          existingCredential.platform === "telegram" &&
          !updateData.data.botToken
        ) {
          return res
            .status(400)
            .json({ error: "Bot token is required for Telegram credentials" });
        }

        if (
          existingCredential.platform === "email" &&
          !updateData.data.apiKey
        ) {
          return res
            .status(400)
            .json({ error: "API key is required for email credentials" });
        }
      }

      const credential = await prisma.credential.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          title: true,
          platform: true,
          data: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.json({
        message: "Credential updated successfully",
        credential,
      });
    } catch (error) {
      console.error("Update credential error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Delete credential
router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Check if credential exists and belongs to user
    const existingCredential = await prisma.credential.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!existingCredential) {
      return res.status(404).json({ error: "Credential not found" });
    }

    await prisma.credential.delete({
      where: { id },
    });

    res.json({ message: "Credential deleted successfully" });
  } catch (error) {
    console.error("Delete credential error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Test credential (validate credentials)
router.post("/:id/test", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const credential = await prisma.credential.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!credential) {
      return res.status(404).json({ error: "Credential not found" });
    }

    // Test credentials based on platform
    let isValid = false;
    let error = "";

    try {
      if (credential.platform === "telegram") {
        // Test Telegram bot token
        const response = await fetch(
          `https://api.telegram.org/bot${credential.data.botToken}/getMe`,
        );
        isValid = response.ok;
        if (!isValid) {
          error = "Invalid Telegram bot token";
        }
      } else if (credential.platform === "email") {
        // Test Resend API key
        const response = await fetch("https://api.resend.com/domains", {
          headers: {
            Authorization: `Bearer ${credential.data.apiKey}`,
            "Content-Type": "application/json",
          },
        });
        isValid = response.ok;
        if (!isValid) {
          error = "Invalid Resend API key";
        }
      }
    } catch (testError) {
      isValid = false;
      error = "Failed to validate credentials";
    }

    res.json({
      isValid,
      error: isValid ? null : error,
    });
  } catch (error) {
    console.error("Test credential error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
