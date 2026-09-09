import type { Request, Response } from "express";
import pool from "../db.js";
import type { RowDataPacket } from "mysql2";

interface Category extends RowDataPacket {
  id: number;
  name: string;
}

export const getCategories = async (req: Request, res: Response) => {
  try {

    const [rows] = await pool.query("SELECT * FROM categories");

    res.status(200).json(rows);

  } catch (error) {
    console.log("Error fetching categories", error);
    res.status(500).json({
      message: "Failed to fetch categories"
    });
  }
}

export const getCategory = async (req: Request, res: Response) => {
  try {

    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    const [rows] = await pool.query<Category[]>("SELECT * FROM categories WHERE id = ?",
      [categoryId]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Category not found",
      })
    }

    return res.status(200).json(rows[0]);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch category"
    })
  }
}

export const createCategory = async (req: Request, res: Response) => {
  try {

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Name category not found",
      })
    }

    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({
        message: "Enter valid name",
      })
    }

    const [result] = await pool.query("INSERT INTO categories (name) VALUES (?)",
      [name.trim()]
    )

    return res.status(201).json({
      message: "Category created successfully",
      name: name.trim(),
    });

  } catch (error) {
    console.log("Error creating category",error);

    return res.status(500).json({
      message: "Failed to create category",
    });
  }
};