import bcrypt from "bcryptjs";
import express, { NextFunction, Response } from "express";
import { body, validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../index";
import { generateToken } from "../middleware/auth";
import { sendOtpEmail } from "../services/emailService";

const router = express.Router();

router.post(
  "/signup",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("name").optional().trim().isLength({ min: 1 }),
  ],
  async (req, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      const { email, password, name } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({
          error: "User already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || null,
          isVerified: false,
        },
        select: {
          id: true,
          email: true,
          name: true,
          isVerified: true,
        },
      });

      await sendOtpEmail(email);

      res.status(201).json({
        message:
          "User created successfully. Please check your email for verification.",
        user,
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

router.post(
  "/signin",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 1 }),
  ],
  async (req, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        if (!errors.isEmpty()) {
          return res.status(400).json({
            errors: errors.array(),
          });
        }

        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return res.status(401).json({
            error: "Invalid credentials",
          });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({
            error: "Invalid credentials",
          });
        }

        if (!user.isVerified) {
          return res.status(401).json({
            error: "Email not verified",
          });
        }

        const token = generateToken(user.id);

        res.json({
          message: "Sign in successful",
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        });
      }
    } catch (error) {
      console.error("Signin error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

router.post(
  "/verify-otp",
  [
    body("email").isEmail().normalizeEmail(),
    body("otp").isLength({ min: 6, max: 6 }),
  ],
  async (req, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, otp } = req.body;

      const otpToken = await prisma.otpToken.findFirst({
        where: {
          email,
          token: otp,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!otpToken) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }

      await prisma.user.update({
        where: { email },
        data: { isVerified: true },
      });

      await prisma.otpToken.delete({
        where: { id: otpToken.id },
      });

      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          isVerified: true,
        },
      });

      const token = generateToken(user!.id);

      res.json({
        message: "Email verified successfully",
        token,
        user,
      });
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Resend OTP
router.post(
  "/resend-otp",
  [body("email").isEmail().normalizeEmail()],
  async (req, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.isVerified) {
        return res.status(400).json({ error: "Email already verified" });
      }

      await sendOtpEmail(email);

      res.json({ message: "OTP sent successfully" });
    } catch (error) {
      console.error("Resend OTP error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

router.get("/google", (req, res) => {
  res.json({ message: "Google OAuth not implemented yet" });
});

export default router;
