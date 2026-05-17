export function addToCart(cartItems, product, amount = 1) {
  const existing = cartItems.find((item) => item.id === product.id);
  if (existing) {
    return cartItems.map((item) =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + amount }
        : item
    );
  }

  return [...cartItems, { ...product, quantity: amount }];
}

export function updateQuantity(cartItems, productId, nextQuantity) {
  return cartItems
    .map((item) =>
      item.id === productId
        ? { ...item, quantity: Math.max(1, nextQuantity) }
        : item
    )
    .filter((item) => item.quantity > 0);
}

export function removeFromCart(cartItems, productId) {
  return cartItems.filter((item) => item.id !== productId);
}

export function clearCart() {
  return [];
}

export function getItemCount(cartItems) {
  return cartItems.reduce((sum, item) => sum + item.quantity, 0);
}

export function getSubtotal(cartItems) {
  return cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
}
