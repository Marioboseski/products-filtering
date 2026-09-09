import { Router } from "express";
import {
  getCategories,
  getCategory,
  createCategory,
} from "../controllers/categoryController.js";

const router = Router();

router.get("/", getCategories);
router.get("/:id", getCategory);
router.post("/", createCategory);

export default router;