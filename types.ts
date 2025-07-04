
export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  description: string;
  imageUrl: string;
  lowStockThreshold: number;
}

export interface CartItem extends Product {
  quantity: number;
  salePrice: number; // Allows for price overrides
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  amountPaid: number;
  change: number;
}

export type View = 'main' | 'checkout' | 'success' | 'inventory' | 'orders';
