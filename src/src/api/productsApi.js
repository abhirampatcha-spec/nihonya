export async function fetchProducts() {
  const response = await fetch("/api/products");
  if (!response.ok) {
    throw new Error("Unable to load products");
  }
  return response.json();
}

export async function fetchProduct(id) {
  const response = await fetch(`/api/products/${id}`);
  if (!response.ok) {
    throw new Error("Unable to load product");
  }
  return response.json();
}
