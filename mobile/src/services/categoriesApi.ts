const API_URL = process.env.EXPO_PUBLIC_API_URL;

import type { Category } from "@/types/product";

export const getCategories = async ():Promise<Category[]> => {
  const res = await fetch(`${API_URL}/api/categories`);

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }
  
  return res.json();
}