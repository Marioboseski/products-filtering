import { View, Text, TextInput, Button, } from "react-native";
import { createProduct } from "@/services/productsApi";
import { getCategories } from "@/services/categoriesApi";
import { useState, useEffect } from "react";
import type { NewProduct, Category, NewProductFormData } from "@/types/product";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";

const AddProduct = () => {

  const [newProduct, setNewProduct] = useState<NewProductFormData>({
    name: "",
    price: "",
    category_id: 0
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [fetchError, setFetchError] = useState("");
  const [createError, setCreateError] = useState("");
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [ isCreating, setIsCreating ] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsCategoriesLoading(true);
        setFetchError("");

        const data = await getCategories();
        setCategories(data);

      } catch (error) {
        setFetchError("Unable to load categories. Try again.")
        console.log(error);
      } finally {
        setIsCategoriesLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    try {
      setIsCreating(true);
      setCreateError("");

      const product: NewProduct = {
        name: newProduct.name,
        price: Number(newProduct.price),
        category_id: newProduct.category_id,
      }

      await createProduct(product);

      router.back();

    } catch (error) {
      setCreateError("Unable to add product. Try again")
      console.log(error);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <View>
      <TextInput
        value={newProduct.name}
        onChangeText={(value) => setNewProduct((prev) => ({
          ...prev, name: value,
        }))}
        placeholder="product name"
      />

      <TextInput
        value={newProduct.price}
        onChangeText={(value) => setNewProduct((prev) => ({
          ...prev, price: value,
        }))}
        placeholder="product price"
        keyboardType="decimal-pad"
      />

      <Picker
        enabled={!isCategoriesLoading}
        selectedValue={newProduct.category_id}
        onValueChange={(value) =>
          setNewProduct((prev) => ({
            ...prev,
            category_id: value,
          }))
        }
      >
        <Picker.Item label="Select category" value={0} />

        {categories.map((category) => (
          <Picker.Item
            key={category.id}
            label={category.name}
            value={category.id}
          />
        ))}
      </Picker>

      <Button
        title={isCreating ? "Adding..." : "Add product"}
        onPress={handleSubmit}
        disabled={isCreating}
      />

       {isCategoriesLoading && (
        <Text>Loading categories</Text>
      )}

      {fetchError && (
        <Text>{fetchError}</Text>
      )}

      {createError && (
        <Text>{createError}</Text>
      )}
    </View>
  );
}

export default AddProduct;