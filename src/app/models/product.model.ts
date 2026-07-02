export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
}

export type ProductInput = Omit<Product, 'id'>;
