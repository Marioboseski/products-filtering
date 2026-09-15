import { View, FlatList, StyleSheet, Pressable } from "react-native"
import { useState, useEffect } from "react";
import type { Product } from "@/types/product";
import { getProducts } from "@/services/productsApi";
import ProductCard from "@/components/products/ProductCard";

const HomeScreen = () => {

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    }
    fetchProducts();
  }, [])

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => item.id.toString()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },

})

export default HomeScreen;