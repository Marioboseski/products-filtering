import { Router } from "express";
import { validateCategory } from "../middleware/validateCategory.js";
import {
  getCategories,
  getCategory,
  createCategory,
} from "../controllers/categoryController.js";

const router = Router();

router.get("/", getCategories);
router.get("/:id", getCategory);
router.post("/", validateCategory, createCategory);

export default router;
