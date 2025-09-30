import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../index";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Access token required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        isVerified: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        error: "Email not verified",
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
    };

    next();
  } catch (error) {
    return res.status(403).json({
      error: "Invalid or expired token",
    });
  }
};

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};
