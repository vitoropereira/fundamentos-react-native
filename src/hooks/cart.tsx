import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity?: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE

      const storageProducts = await AsyncStorage.getItem(`@gomarketplace`)

      if (storageProducts) {
        setProducts(JSON.parse(storageProducts))
      }
    }

    loadProducts();

  }, []);

  const addToCart = useCallback(async product => {
    // TODO ADD A NEW ITEM TO THE CART
    const findProducts = products.find(findProduct => findProduct.id === product.id)

    if (findProducts) {
      await increment(product.id)
      return
    }

    setProducts([...products, { ...product, quantity: 1 }])

    await AsyncStorage.setItem(`@gomarketplace`, JSON.stringify(products))
  }, [products]);

  const increment = useCallback(async id => {
    // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
    const incrementProduct = products.map(product => {
      if (product.id === id) {
        if (product.quantity) {
          product.quantity += 1
        }
      }
      return product
    })

    setProducts(incrementProduct)

    await AsyncStorage.setItem(`@gomarketplace`, JSON.stringify(incrementProduct))

  }, [products]);

  const decrement = useCallback(async id => {
    // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
    const incrementProduct = products.map(product => {
      if (product.id === id) {
        if (product.quantity) {
          product.quantity -= 1
        }
      }
      return product
    })

    setProducts(incrementProduct)

    await AsyncStorage.setItem(`@gomarketplace`, JSON.stringify(incrementProduct))

  }, [products]);

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
