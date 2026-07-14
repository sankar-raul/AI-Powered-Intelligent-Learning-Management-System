import { Request, Response } from "express";
import AuthService from "@/services/auth.service.js";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required credentials.",
      });
    }

    const data = await AuthService.login(email, password, role);
    return res.status(200).json({
      message: "Login successful.",
      ...data,
    });
  } catch (error) {
    console.error("Controller login error:", error);
    return res.status(401).json({
      message: error instanceof Error ? error.message : "Authentication failed.",
    });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        message: "Unauthorized access. No session active.",
      });
    }

    const profile = await AuthService.getUserProfile(req.user.userId);
    return res.status(200).json({
      user: profile,
    });
  } catch (error) {
    console.error("Controller me error:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error fetching session profile.",
    });
  }
};
