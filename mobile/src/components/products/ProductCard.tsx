import { View, Text, StyleSheet, Pressable } from "react-native"
import type { ProductProps } from "@/types/product";

const ProductCard = ({product, onDelete, isDeleting}: ProductProps) => {
  return (
    <View style={styles.productCard}>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>${product.price}</Text>
      <Pressable onPress={() => onDelete(product.id)} style={styles.deleteButton} disabled={isDeleting}>
        <Text style={styles.deleteButtonText}>{isDeleting ? "Deleting..." : "X"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    width: "50%",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 11,
    gap: 5,
    borderWidth: 1 ,
    borderColor: "black",
    alignItems: "center"
  },

  productName: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  productPrice: {
    fontSize: 17,
  },

  deleteButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
    minWidth: 35
  },

  deleteButtonText: {
    fontSize: 20,
    textAlign: "center",
  }

})

export default ProductCard;