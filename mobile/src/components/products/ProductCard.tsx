import { View, Text, StyleSheet } from "react-native"
import type { ProductProps } from "@/types/product";

const ProductCard = ({product}: ProductProps) => {
  return (
    <View style={styles.productCard}>
      <Text>{product.name}</Text>
      <Text>{product.price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: "red",
    borderRadius: 10,
    gap: 5
  },

})

export default ProductCard;