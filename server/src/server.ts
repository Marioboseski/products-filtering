import express from "express";
import categoriesRoutes from "./routes/categoryRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/categories",categoriesRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});