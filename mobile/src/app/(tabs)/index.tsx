import { View, Text, FlatList, StyleSheet, Pressable, TextInput } from "react-native"
import { useState, useCallback } from "react";
import type { Product } from "@/types/product";
import { getProducts, deleteProduct } from "@/services/productsApi";
import ProductCard from "@/components/products/ProductCard";
import { router, useFocusEffect } from "expo-router";
import { ActivityIndicator } from "react-native";

const HomeScreen = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);

  useFocusEffect(useCallback(() => {
    const fetchProducts = async () => {
      try {
        setIsProductsLoading(true);
        setFetchError("");

        const data = await getProducts();
        setProducts(data);

      } catch (error) {
        setFetchError("Unable to load products. Try again.")
        console.log(error);
      } finally {
        setIsProductsLoading(false);
      }
    }
    fetchProducts();
  }, []));

  const handleDeleteProduct = async (id: number) => {
    try {

      setDeleteError("");
      setDeletingProductId(id);

      await deleteProduct(id);

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id));

    } catch (error) {
      setDeleteError("Unable to delete the product. Try again.")
      console.log(error);
    } finally {
      setDeletingProductId(null);
    }
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

      {isProductsLoading && (
        <ActivityIndicator size={"large"} />
      )}

      {fetchError && (
        <Text style={styles.errorText}>{fetchError}</Text>
      )}

      {deleteError && (
        <Text style={styles.errorText}>{deleteError}</Text>
      )}

      {search.trim().length > 0 && searchFilteredProducts.length === 0 && (
        <Text style={styles.noProductText}>No product found</Text>
      )}

      <FlatList
        data={searchFilteredProducts}
        numColumns={2}
        renderItem={({ item }) => <ProductCard product={item} onDelete={handleDeleteProduct} isDeleting={deletingProductId === item.id} />}
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
  },

  errorText: {
    textAlign: "center",
    fontSize: 25,
    color: "red",
  }

})

export default HomeScreen;