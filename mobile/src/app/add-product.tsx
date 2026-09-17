import { View, TextInput, Button, } from "react-native";
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

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    }
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    const product: NewProduct = {
      name: newProduct.name,
      price: Number(newProduct.price),
      category_id: newProduct.category_id,
    }

    await createProduct(product);

    router.back();
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
        title="Add product"
        onPress={handleSubmit}
      />
    </View>
  );
}

export default AddProduct;