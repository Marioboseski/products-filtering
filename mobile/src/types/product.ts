export type Product = {
  id: number,
  name: string,
  price: string,
  category_id: number;
}

export type ProductProps = {
  product: Product
}

export type NewProduct = {
  name: string,
  price: number,
  category_id: number,
}

export type Category = {
  id: number,
  name: string,
}

export type NewProductFormData = {
  name: string,
  price: string,
  category_id: number,
}