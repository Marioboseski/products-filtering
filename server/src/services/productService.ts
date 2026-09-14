import type { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../db.js";
import { CategoryNotFoundError, getCategoryById } from "./categoryService.js";

interface Product extends RowDataPacket {
  id: number;
  name: string;
  // MySQL DECIMAL values are returned as strings to preserve precision.
  price: string;
  category_id: number;
}

interface ProductInput {
  name: string;
  price: number;
  category_id: number;
}

async function requireCategory(id: number) {
  if (!(await getCategoryById(id))) {
    throw new CategoryNotFoundError();
  }
}

export async function getProducts() {
  const [products] = await pool.query<Product[]>("SELECT * FROM products");
  return products;
}

export async function getProductById(id: number) {
  const [products] = await pool.execute<Product[]>(
    "SELECT * FROM products WHERE id = ?",
    [id],
  );
  return products[0] ?? null;
}

export async function createProduct(input: ProductInput) {
  await requireCategory(input.category_id);
  const name = input.name.trim();
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO products (name, price, category_id) VALUES (?, ?, ?)",
    [name, input.price, input.category_id],
  );
  return { id: result.insertId, name, price: input.price, category_id: input.category_id };
}

export async function updateProduct(id: number, input: ProductInput) {
  if (!(await getProductById(id))) return false;
  await requireCategory(input.category_id);
  const [result] = await pool.execute<ResultSetHeader>(
    "UPDATE products SET name = ?, price = ?, category_id = ? WHERE id = ?",
    [input.name.trim(), input.price, input.category_id, id],
  );
  return result.affectedRows > 0;
}

export async function deleteProduct(id: number) {
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM products WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
}
