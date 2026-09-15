export type Product = {
  id: number,
  name: string,
  price: string,
  category_id: number;
}

export type ProductProps = {
  product: Product
}