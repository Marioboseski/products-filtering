const API_URL = process.env.EXPO_PUBLIC_API_URL;
import type { Product, NewProduct } from "@/types/product";

export const getProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${API_URL}/api/products`);

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export const createProduct = async (product: NewProduct): Promise<Product> => {
  const res = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type" : "application/json",
    },
    body: JSON.stringify(product)
  });

  return res.json();
}