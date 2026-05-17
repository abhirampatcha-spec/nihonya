import { useEffect, useMemo, useState } from "react";
import { CartContext } from "./cartContextObject";
import {
  addToCart as addToCartHelper,
  updateQuantity as updateQuantityHelper,
  removeFromCart as removeFromCartHelper,
  clearCart as clearCartHelper,
  getItemCount,
  getSubtotal,
} from "../../shared/cart/cartUtils";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("nihonya-cart")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("nihonya-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((current) => addToCartHelper(current, product));
  };

  const updateQuantity = (productId, nextQuantity) => {
    setCartItems((current) =>
      updateQuantityHelper(current, productId, nextQuantity)
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((current) => removeFromCartHelper(current, productId));
  };

  const clearCart = () => setCartItems(clearCartHelper());

  const itemCount = useMemo(() => getItemCount(cartItems), [cartItems]);

  const subtotal = useMemo(() => getSubtotal(cartItems), [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

