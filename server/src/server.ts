import express from "express";
import categoriesRoutes from "./routes/categoryRoutes.js";
import productsRoutes from "./routes/productRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/categories",categoriesRoutes);
app.use("/api/products", productsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});