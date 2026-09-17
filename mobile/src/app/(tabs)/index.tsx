import { View, Text, FlatList, StyleSheet, Pressable, TextInput } from "react-native"
import { useState, useCallback } from "react";
import type { Product } from "@/types/product";
import { getProducts, deleteProduct } from "@/services/productsApi";
import ProductCard from "@/components/products/ProductCard";
import { router, useFocusEffect } from "expo-router";

const HomeScreen = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

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

  const searchFilteredProducts = products.filter((filteredProduct) =>
    filteredProduct.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search products..."
        style={styles.searchInput}
      />

      {search.trim().length > 0 && searchFilteredProducts.length === 0 && (
        <Text style={styles.noProductText}>No product found</Text>
      )}

      <FlatList
        data={searchFilteredProducts}
        numColumns={2}
        renderItem={({ item }) => <ProductCard product={item} onDelete={handleDeleteProduct} />}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={
          <Pressable
            style={styles.addButton}
            onPress={() => router.push("/add-product")}>
            <Text style={styles.addButtonText}>Add product</Text>
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
    backgroundColor: "#22db44",
    padding: 5,
    borderRadius: 10,
    marginTop: 15
  },

  addButtonText: {
    textAlign: "center",
    fontSize: 20,
  },

  searchInput: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    fontSize: 18,
    marginBottom: 15
  },

  noProductText: {
    textAlign: "center",
    fontWeight: "bold",
  }

})

export default HomeScreen;