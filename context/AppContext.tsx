
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, CartItem, Order } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { INITIAL_PRODUCTS } from '../constants';

interface AppContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  updateCartItemPrice: (productId: string, newPrice: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useLocalStorage<Product[]>('products', INITIAL_PRODUCTS);
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', []);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...productData, id: `prod_${new Date().getTime()}` };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };
  
  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert(`${product.name} is out of stock.`);
      return;
    }
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
           return prevCart.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          alert(`Cannot add more ${product.name}. Stock limit reached.`);
          return prevCart;
        }
      } else {
        return [...prevCart, { ...product, quantity: 1, salePrice: product.price }];
      }
    });
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if(quantity > product.stock) {
      alert(`Cannot set quantity for ${product.name} above stock limit of ${product.stock}.`);
      return;
    }

    if(quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };
  
  const updateCartItemPrice = (productId: string, newPrice: number) => {
    setCart(prev => prev.map(item => item.id === productId ? {...item, salePrice: newPrice} : item));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'date'>) => {
      const newOrder: Order = {
          ...orderData,
          id: `order_${new Date().getTime()}`,
          date: new Date().toISOString()
      };
      setOrders(prev => [newOrder, ...prev]);

      // Decrement stock
      setProducts(prevProducts => 
        prevProducts.map(p => {
          const orderedItem = newOrder.items.find(item => item.id === p.id);
          if (orderedItem) {
            return { ...p, stock: p.stock - orderedItem.quantity };
          }
          return p;
        })
      );
  };

  const value = {
    products,
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    cart,
    addToCart,
    updateCartItemQuantity,
    updateCartItemPrice,
    removeFromCart,
    clearCart,
    orders,
    addOrder,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
