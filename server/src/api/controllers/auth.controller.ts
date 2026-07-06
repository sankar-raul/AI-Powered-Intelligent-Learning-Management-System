import { Request, Response } from "express";
import ROLE from "@/constants/role.constant.js";
import authService from "@/services/auth.service.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ message: "name, email, password and role are required" });
      return;
    }

    if (!Object.values(ROLE).includes(role)) {
      res.status(400).json({ message: "Invalid role" });
      return;
    }

    const data = await authService.register({ name, email, password, role });
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "email and password are required" });
      return;
    }

    const data = await authService.login({ email, password });
    res.status(200).json(data);
  } catch (error) {
    res.status(401).json({ message: (error as Error).message });
  }
};

export const me = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  res.status(200).json({ user: req.user });
};
