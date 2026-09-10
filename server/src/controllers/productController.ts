import type { Request, Response } from "express";
import pool from "../db.js";
import type { RowDataPacket } from "mysql2";
import type { ResultSetHeader } from "mysql2";

interface Product extends RowDataPacket {
  id: number;
  name: string;
  price: number;
  category_id: number;
}

export const getProducts = async (req: Request, res: Response) => {
  try {

    const [rows] = await pool.query("SELECT * FROM products");

    res.status(200).json(rows);

  } catch (error) {
    console.log("Error fetching products", error);

    return res.status(500).json({
      message: "Failed to fetch products",
    })
  }
}

export const getProductById = async (req: Request, res: Response) => {

  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const [rows] = await pool.query<Product[]>("SELECT * FROM products WHERE id = ?",
      [productId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      })
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.log("Error fetching product", error);

    return res.status(500).json({
      message: "Failed to fetch product",
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {

    const { name, price, category_id } = req.body;

    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({
        message: "Enter valid name",
      })
    }

    if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
      return res.status(400).json({
        message: "Enter valid price"
      })
    }

    if (!Number.isInteger(category_id) || category_id <= 0) {
      return res.status(400).json({
        message: "Invalid category id",
      })
    }

    const [result] = await pool.query<ResultSetHeader>
      ("INSERT INTO products (name, price, category_id) VALUES (?, ?, ?)",
        [name, price, category_id]
      );

    return res.status(201).json({
      message: "Product created successfully",
      id: result.insertId,
      name: name.trim(),
      price,
      category_id,
    })

  } catch (error) {
    console.log("Error creating product", error);

    return res.status(500).json({
      message: "Failed to create product",
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    const [result] = await pool.query<ResultSetHeader>
      ("DELETE FROM products WHERE id = ?",
        [productId]
      )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      })
    }

    return res.status(200).json({
      message: "Product deleted",
    });

  } catch (error) {
    console.log("Error deleting product", error);

    return res.status(500).json({
      message: "Failed to delete product",
    })
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {

    const productId = Number(req.params.id);
    const { name, price, category_id } = req.body;

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({
        message: "Enter valid name",
      })
    }

    if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
      return res.status(400).json({
        message: "Enter valid price"
      })
    }

    if (!Number.isInteger(category_id) || category_id <= 0) {
      return res.status(400).json({
        message: "Invalid category id",
      })
    }

    const [result] = await pool.query<ResultSetHeader>
      ("UPDATE products SET name = ?, price = ?, category_id = ? WHERE id = ?",
        [name.trim(), price, category_id, productId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      id: productId,
    })

  } catch (error) {
    console.log(error)

    return res.status(500).json({
      message: "Failed to update product",
    })
  }
}