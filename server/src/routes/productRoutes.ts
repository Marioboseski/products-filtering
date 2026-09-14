import { Router } from "express";
import { validateProduct } from "../middleware/validateProduct.js";
import {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct
} from "../controllers/productController.js";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", validateProduct, createProduct);
router.delete("/:id", deleteProduct);
router.put("/:id", validateProduct, updateProduct);

export default router;
