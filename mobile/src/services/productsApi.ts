const API_URL = process.env.EXPO_PUBLIC_API_URL;
import type { Product } from "@/types/product";

export const getProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${API_URL}/api/products`);

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}