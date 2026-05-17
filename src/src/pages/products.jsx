import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { products } from "../../shared/data/products";
import { categories } from "../../shared/constants/categories";
import { useCart } from "../context/useCart";
import { useFavorites } from "../context/useFavorites";

export default function Products() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);
  const [productsData, setProductsData] = useState(products);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productError, setProductError] = useState(null);
  const { addToCart, itemCount } = useCart();
  const { toggleFavorite, favoriteIds } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Unable to fetch products");
        }
        const data = await response.json();
        setProductsData(data);
      } catch (error) {
        setProductError(error.message);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const formatINR = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

  const filteredProducts = useMemo(() => {
    return productsData
      .filter((item) =>
        selectedCategory === "All"
          ? true
          : item.category === selectedCategory
      )
      .filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      );
  }, [search, selectedCategory]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const formatINR = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen bg-[#F4F1EC] pt-28 p-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <Link to="/" className="transition hover:text-black">
            Home
          </Link>
          <span>›</span>
          <span className="font-semibold text-black">Products</span>
        </div>
        <Link
          to="/"
          className="rounded-full bg-white px-5 py-3 text-black shadow-sm transition hover:bg-black hover:text-white"
        >
          Go Home
        </Link>
      </div>

      <div className="flex flex-col gap-6 mb-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-6xl font-black mb-4">Products</h1>
          <p className="text-neutral-600 max-w-2xl">
            Browse our premium Japanese-inspired furniture, filter by category, search for the perfect piece, and add it to your cart.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-full md:w-[320px]">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-black/10 bg-white px-6 py-4 outline-none shadow-sm"
            />
          </div>

          <Link
            to="/cart"
            className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-4 text-white shadow-lg"
          >
            Cart {itemCount > 0 && <span>({itemCount})</span>}
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full px-6 py-3 transition ${
              selectedCategory === category
                ? "bg-black text-white"
                : "bg-white border border-black/10 text-neutral-600"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {productError ? (
        <div className="rounded-[40px] bg-white p-10 text-center shadow-xl mb-10">
          <p className="text-2xl font-bold">Unable to load products</p>
          <p className="mt-4 text-neutral-500">{productError}</p>
        </div>
      ) : loadingProducts ? (
        <div className="rounded-[40px] bg-white p-10 text-center shadow-xl mb-10">
          <p className="text-2xl font-bold">Loading products...</p>
        </div>
      ) : null}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">
        {visibleProducts.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-[40px] overflow-hidden shadow-xl transition hover:-translate-y-1"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-[340px] object-cover"
            />

            <div className="p-8">
              <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
                    {item.category}
                  </p>
                  <h2 className="text-3xl font-bold mt-2">{item.name}</h2>
                </div>
                <span className="text-3xl font-black">{formatINR(item.price)}</span>
              </div>

              <p className="text-neutral-500 leading-7 mb-8">
                {item.description}
              </p>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <Link
                  to={`/product/${item.id}`}
                  className="inline-flex w-full justify-center rounded-full border border-black/10 bg-white px-6 py-3 text-black transition hover:bg-black hover:text-white sm:w-auto"
                >
                  View Details
                </Link>

                <div className="flex flex-wrap justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(item)}
                    className={`rounded-full px-5 py-3 transition ${
                      favoriteIds.has(item.id)
                        ? "bg-red-600 text-white"
                        : "bg-white border border-black/10 text-black"
                    }`}
                  >
                    {favoriteIds.has(item.id) ? "♥ Favorited" : "♡ Favorite"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      addToCart(item);
                      navigate("/checkout");
                    }}
                    className="rounded-full bg-black px-6 py-3 text-white transition hover:bg-neutral-800"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="mt-16 rounded-[40px] bg-white p-12 text-center shadow-xl">
          <h2 className="text-4xl font-black mb-4">No products found</h2>
          <p className="text-neutral-500">
            Try changing your search term or category filter.
          </p>
        </div>
      )}

      {hasMore && (
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + 6)}
            className="rounded-full bg-black px-10 py-4 text-white transition hover:bg-neutral-800"
          >
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
}