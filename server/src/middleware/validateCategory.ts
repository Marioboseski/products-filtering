import type { Request, Response, NextFunction } from "express";

export function validateCategory(req: Request, res: Response, next: NextFunction) {
  const { name } = req.body ?? {};

  if (!name) {
    return res.status(400).json({
      message: "Name category not found",
    });
  }

  if (typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({
      message: "Enter valid name",
    });
  }

  next();
}
