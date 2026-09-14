import type { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../db.js";

interface Category extends RowDataPacket {
  id: number;
  name: string;
}

export class CategoryNotFoundError extends Error {
  constructor() {
    super("Category not found");
    this.name = "CategoryNotFoundError";
  }
}

export async function getCategories() {
  const [categories] = await pool.query<Category[]>("SELECT * FROM categories");
  return categories;
}

export async function getCategoryById(id: number) {
  const [categories] = await pool.execute<Category[]>(
    "SELECT * FROM categories WHERE id = ?",
    [id],
  );
  return categories[0] ?? null;
}

export async function createCategory(name: string) {
  const normalizedName = name.trim();
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO categories (name) VALUES (?)",
    [normalizedName],
  );
  return { id: result.insertId, name: normalizedName };
}
