import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { products } from "../../shared/data/products";
import { useCart } from "../context/useCart";
import { useFavorites } from "../context/useFavorites";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { toggleFavorite, favoriteIds } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const localProduct = useMemo(
    () => products.find((item) => item.id === Number(id)),
    [id]
  );
  const [product, setProduct] = useState(localProduct);
  const [loading, setLoading] = useState(!localProduct);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Unable to load product from backend");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load product";
        setError(message);
        setProduct(localProduct ?? null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, localProduct]);

  const normalizedProduct = {
    ...product,
    features: product?.features || [],
    sourceLink: product?.sourceLink || "",
  };

  const formatINR = (value) => `₹${Number(value).toLocaleString("en-IN")}`;
  const bankOffers = [
    { label: "HDFC Bank", discount: "5% off" },
    { label: "ICICI Bank", discount: "4% cashback" },
    { label: "SBI Card", discount: "EMI 6 months" },
  ];

  if (loading && !product) {
    return (
      <div className="min-h-screen bg-[#F4F1EC] pt-28 p-10">
        <h1 className="text-6xl font-black">Loading product...</h1>
      </div>
    );
  }

  if (!normalizedProduct || !normalizedProduct.id) {
    return (
      <div className="min-h-screen bg-[#F4F1EC] pt-28 p-10">
        <h1 className="text-6xl font-black">Product not found</h1>
        <Link
          to="/products"
          className="mt-8 inline-block rounded-full bg-black px-8 py-4 text-white"
        >
          Back to products
        </Link>
      </div>
    );
  }

  const inCart = cartItems.some((item) => item.id === product.id);

  const handleBuyNow = () => {
    for (let index = 0; index < quantity; index += 1) {
      addToCart(product);
    }
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#F4F1EC] pt-28 p-10">
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link
            to="/"
            className="rounded-full bg-white px-5 py-3 text-black shadow-sm transition hover:bg-black hover:text-white"
          >
            Home
          </Link>
          <div>
            <p className="uppercase tracking-[0.3em] text-sm text-neutral-500 mb-2">
              {product.category}
            </p>
            <h1 className="text-6xl font-black">{product.name}</h1>
          </div>
        </div>
        <Link
          to="/products"
          className="rounded-full bg-white px-6 py-3 text-black shadow-sm"
        >
          Back to Products
        </Link>
      </div>
      {error && (
        <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700">
          <p className="font-semibold">Unable to refresh from backend.</p>
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[40px] bg-white p-8 shadow-xl">
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-[40px] object-cover"
          />

          <div className="mt-8 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-3xl font-black">{formatINR(product.price)}</p>
                <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mt-2">
                  Available now • Free shipping
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleFavorite(product)}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                  favoriteIds.has(product.id)
                    ? "bg-red-600 text-white"
                    : "bg-white border border-black/10 text-black"
                }`}
              >
                {favoriteIds.has(product.id) ? "♥ Favorited" : "♡ Favorite"}
              </button>
            </div>

            <p className="text-neutral-600 leading-8">{product.description}</p>

            <div className="grid gap-4 sm:grid-cols-2">
              {normalizedProduct.features.map((feature, index) => (
                <div key={index} className="rounded-3xl bg-[#F4F1EC] p-6">
                  {feature}
                </div>
              ))}
            </div>
            {normalizedProduct.sourceLink && (
              <div className="mt-8 rounded-[30px] bg-[#F4F1EC] p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-2">
                  Source Link
                </p>
                <a
                  href={normalizedProduct.sourceLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-black font-semibold underline"
                >
                  View source on the backend
                </a>
              </div>
            )}
            <div className="mt-8 rounded-[30px] bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-bold">Bank Offers & Payment</h3>
              <p className="mt-3 text-neutral-500">
                Use Indian bank offers and secure payment methods at checkout.
              </p>
              <div className="mt-5 grid gap-3">
                {bankOffers.map((offer) => (
                  <div key={offer.label} className="rounded-3xl bg-[#F4F1EC] p-4">
                    <p className="font-semibold">{offer.label}</p>
                    <p className="text-sm text-neutral-500 mt-2">{offer.discount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[40px] bg-white p-10 shadow-xl">
          <div className="space-y-6">
            <div className="rounded-[30px] bg-[#F4F1EC] p-6">
              <h2 className="text-3xl font-black">Purchase Options</h2>
              <p className="mt-3 text-neutral-500">
                Choose quantity and complete your order instantly.
              </p>
            </div>

            <div className="rounded-[30px] border border-black/10 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-3">
                Quantity
              </p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
                  className="h-12 w-12 rounded-full bg-white text-2xl"
                >
                  −
                </button>
                <span className="text-2xl font-black">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((qty) => qty + 1)}
                  className="h-12 w-12 rounded-full bg-white text-2xl"
                >
                  +
                </button>
              </div>
            </div>

            <div className="rounded-[30px] bg-[#F4F1EC] p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-2">
                Total Price
              </p>
              <p className="text-4xl font-black">{formatINR(product.price * quantity)}</p>
            </div>

            <div className="grid gap-4">
              <button
                type="button"
                onClick={() => {
                  for (let i = 0; i < quantity; i += 1) addToCart(product);
                }}
                className="rounded-full bg-black px-10 py-5 text-white text-lg font-semibold transition hover:bg-neutral-800"
              >
                {inCart ? "Add Another" : "Add To Cart"}
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="rounded-full bg-[#111] px-10 py-5 text-white text-lg font-semibold"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 rounded-[40px] bg-white p-10 shadow-xl">
        <h2 className="text-4xl font-black mb-6">Why customers love it</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-[#F4F1EC] p-6">
            <h3 className="font-semibold">Premium Materials</h3>
            <p className="mt-3 text-neutral-500">
              Crafted using high-grade materials for long-lasting style and comfort.
            </p>
          </div>
          <div className="rounded-3xl bg-[#F4F1EC] p-6">
            <h3 className="font-semibold">Modern Aesthetic</h3>
            <p className="mt-3 text-neutral-500">
              A refined look that fits luxury interiors and contemporary living spaces.
            </p>
          </div>
          <div className="rounded-3xl bg-[#F4F1EC] p-6">
            <h3 className="font-semibold">Ready to Ship</h3>
            <p className="mt-3 text-neutral-500">
              Fast domestic delivery and simple checkout for a seamless purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}