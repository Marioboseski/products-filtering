import type { Request, Response, NextFunction } from "express";

export function validateProduct(req: Request, res: Response, next: NextFunction) {
  const { name, price, category_id } = req.body ?? {};

  if (typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({
      message: "Enter valid name",
    });
  }

  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
    return res.status(400).json({
      message: "Enter valid price"
    });
  }

  if (!Number.isInteger(category_id) || category_id <= 0) {
    return res.status(400).json({
      message: "Invalid category id",
    });
  }

  next();
}
