import { View, Text, StyleSheet, Pressable } from "react-native"
import type { ProductProps } from "@/types/product";

const ProductCard = ({product, onDelete}: ProductProps) => {
  return (
    <View style={styles.productCard}>
      <Text>{product.name}</Text>
      <Text>{product.price}</Text>
      <Pressable onPress={() => onDelete(product.id)}>
        <Text>X</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    padding: 10,
    width: "100%",
    maxWidth: 150,
    backgroundColor: "gray",
    borderRadius: 10,
    gap: 5,
  },

})

export default ProductCard;