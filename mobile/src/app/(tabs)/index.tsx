import { View, Text, FlatList, StyleSheet, Pressable, TextInput } from "react-native"
import { useState } from "react";
import { getProducts, deleteProduct } from "@/services/productsApi";
import ProductCard from "@/components/products/ProductCard";
import { router } from "expo-router";
import { ActivityIndicator } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const HomeScreen = () => {

  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);

  const { data: products = [], isLoading: isProductsLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  })

  const handleDeleteProduct = async (id: number) => {

    setDeleteError("");
    setDeletingProductId(id);

    deleteMutation.mutate(id, {
      onError: (error) => {
        setDeleteError("Unable to delete product. Try again");
        console.log(error);
      },
      onSettled: () => {
        setDeletingProductId(null);
      }
    });
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

      {isError && (
        <Text style={styles.errorText}>Unable to load products. Try again.</Text>
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