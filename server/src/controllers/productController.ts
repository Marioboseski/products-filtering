import type { Request, Response } from "express";
import * as productService from "../services/productService.js";
import { CategoryNotFoundError } from "../services/categoryService.js";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getProducts();

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products", error);

    return res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await productService.getProductById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product", error);

    return res.status(500).json({
      message: "Failed to fetch product",
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, category_id } = req.body ?? {};

    const product = await productService.createProduct({ name, price, category_id });

    return res.status(201).json({
      message: "Product created successfully",
      ...product,
    });
  } catch (error) {
    if (error instanceof CategoryNotFoundError) {
      return res.status(400).json({ message: error.message });
    }

    console.error("Error creating product", error);

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

    const deleted = await productService.deleteProduct(productId);

    if (!deleted) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product deleted",
    });
  } catch (error) {
    console.error("Error deleting product", error);

    return res.status(500).json({
      message: "Failed to delete product",
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);
    const { name, price, category_id } = req.body ?? {};

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const updated = await productService.updateProduct(productId, { name, price, category_id });

    if (!updated) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      id: productId,
    });
  } catch (error) {
    if (error instanceof CategoryNotFoundError) {
      return res.status(400).json({ message: error.message });
    }

    console.error(error);

    return res.status(500).json({
      message: "Failed to update product",
    });
  }
};
