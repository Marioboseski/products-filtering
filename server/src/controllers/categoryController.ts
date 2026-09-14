import type { Request, Response } from "express";
import * as categoryService from "../services/categoryService.js";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getCategories();

    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories", error);
    return res.status(500).json({
      message: "Failed to fetch categories"
    });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    const category = await categoryService.getCategoryById(categoryId);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch category"
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body ?? {};

    const category = await categoryService.createCategory(name);

    return res.status(201).json({
      message: "Category created successfully",
      ...category,
    });
  } catch (error) {
    console.error("Error creating category", error);

    return res.status(500).json({
      message: "Failed to create category",
    });
  }
};
