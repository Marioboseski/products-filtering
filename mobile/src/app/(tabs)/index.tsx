import { View, Text, FlatList, StyleSheet, Pressable } from "react-native"
import { useState, useCallback } from "react";
import type { Product } from "@/types/product";
import { getProducts, deleteProduct } from "@/services/productsApi";
import ProductCard from "@/components/products/ProductCard";
import { router, useFocusEffect } from "expo-router";

const HomeScreen = () => {

  const [products, setProducts] = useState<Product[]>([]);

  useFocusEffect(useCallback(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    }
    fetchProducts();
  }, []));

  const handleDeleteProduct = async (id: number) => {
    await deleteProduct(id);

    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id));
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        numColumns={2}
        renderItem={({ item }) => <ProductCard product={item} onDelete={handleDeleteProduct} />}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={
          <Pressable
            style={styles.addButton}
            onPress={() => router.push("/add-product")}>
            <Text>Add product</Text>
          </Pressable>
        } />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 4,
    padding: 56,
  },

  addButton: {
    backgroundColor: "green",
    padding: 5,
    borderRadius: 10,
  },

})

export default HomeScreen;