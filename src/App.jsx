import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { products } from "./shared/data/products";
import { categories } from "./shared/constants/categories";
import { useCart } from "./src/context/useCart";
import { useFavorites } from "./src/context/useFavorites";

export default function App() {
  const [selected, setSelected] = useState("All");
  const [showLaunchOffer, setShowLaunchOffer] = useState(true);
  const [productsData, setProductsData] = useState(products);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productError, setProductError] = useState(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleFavorite, favoriteIds } = useFavorites();

  const formatINR = (value) => `₹${Number(value).toLocaleString("en-IN")}`;
  const bankOffers = [
    { label: "HDFC Bank", discount: "5% off" },
    { label: "ICICI Bank", discount: "4% cashback" },
    { label: "SBI Card", discount: "EMI 6 months" },
  ];

  const paymentMethods = [
    "UPI / Paytm / PhonePe / GPay",
    "Visa / Mastercard / RuPay",
    "Netbanking / EMI options",
  ];

  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to load products from backend");
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

  const featuredProducts = productsData
    .filter((item) => selected === "All" || item.category === selected)
    .slice(0, 3);

  return (
    <div className="bg-[#F4F1EC] min-h-screen overflow-x-hidden">
      {showLaunchOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
          <div className="w-full max-w-xl rounded-[40px] bg-white p-8 shadow-2xl">
            <div className="flex flex-col gap-4">
              <span className="text-sm uppercase tracking-[0.3em] text-neutral-500">
                Launch offer
              </span>
              <h2 className="text-4xl font-black">
                Flat 25% off on selected products
              </h2>
              <p className="text-neutral-600 leading-8">
                Use code <span className="font-semibold">NIHONYA25</span> and enjoy extra savings with Indian banks.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {bankOffers.map((offer) => (
                  <div key={offer.label} className="rounded-[30px] border border-black/10 bg-[#F4F1EC] p-4">
                    <p className="font-semibold">{offer.label}</p>
                    <p className="text-sm text-neutral-500 mt-2">{offer.discount}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowLaunchOffer(false)}
                className="mt-4 rounded-full bg-black px-8 py-4 text-white"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
      {/* HERO */}
      <section className="min-h-screen flex flex-col lg:flex-row items-center justify-between px-8 lg:px-20 pt-40 gap-20">
        <div className="max-w-2xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-4 rounded-[30px] bg-white px-5 py-3 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-black text-lg font-black text-white">
                N
              </div>
              <div>
                <p className="font-black text-xl">Nihonya</p>
                <p className="text-sm text-neutral-500">Japanese furniture in India</p>
              </div>
            </div>
            <div className="rounded-full bg-yellow-200 px-4 py-3 text-sm font-semibold text-neutral-800">
              Launch Offer: Flat 25% off selected products
            </div>
          </div>

          <div className="inline-flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-sm mb-8">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            Premium Japanese Furniture
          </div>

          <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight text-[#111]">
            Create Your
            <br />
            Perfect Home
            <br />
            Vibe
          </h1>

          <p className="mt-8 text-lg text-neutral-600 leading-8 max-w-xl">
            Explore modern Japanese furniture crafted for comfort,
            beauty and timeless luxury.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {paymentMethods.map((method) => (
              <div key={method} className="rounded-[30px] bg-white px-5 py-4 shadow-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Payment</p>
                <p className="mt-2 font-semibold text-black">{method}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-5 mt-10 flex-wrap">
            <Link
            to="/products"
            className="bg-black text-white px-8 py-4 rounded-full hover:scale-105 transition"
          >
            Explore Collection
          </Link>

          <button className="bg-white px-8 py-4 rounded-full border border-black/10">
            View Lookbook
          </button>
          </div>
        </div>

        {/* HERO IMAGE */}
        <div className="relative w-full lg:w-[45%]">
          <div className="absolute -inset-10 bg-[#DDD7CF] rounded-[60px] blur-3xl opacity-70"></div>

          <div className="relative bg-white p-6 rounded-[50px] shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=1200&auto=format&fit=crop"
              alt="Chair"
              className="w-full h-[650px] object-cover rounded-[40px]"
            />

            <div className="absolute bottom-10 left-10 bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-lg">
              <h3 className="text-2xl font-bold">
                Luxe Recliner
              </h3>

              <p className="text-neutral-500 mt-2">
                Soft Support, Stylish Modern Design
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-8 lg:px-20 pb-10">
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setSelected(item)}
              className={`px-7 py-4 rounded-full transition ${
                selected === item
                  ? "bg-black text-white"
                  : "bg-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section
        id="products"
        className="px-8 lg:px-20 py-24"
      >
        <div className="flex justify-between items-end mb-16 flex-wrap gap-5">
          <div>
            <p className="uppercase tracking-[0.3em] text-sm text-neutral-500 mb-4">
              New Collections
            </p>

            <h2 className="text-5xl md:text-6xl font-black tracking-tight">
              Luxury Furniture
            </h2>
          </div>

          <Link
            to="/products"
            className="text-lg font-medium underline transition hover:text-black/70"
          >
            See All →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">
          {featuredProducts.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[45px] overflow-hidden shadow-xl hover:-translate-y-3 transition"
            >
              <div className="bg-[#EFEAE4] p-8">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-[320px] object-cover rounded-[35px]"
                />
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
                      {item.category}
                    </p>
                    <h3 className="text-3xl font-bold mt-2">
                      {item.name}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFavorite(item)}
                    className={`w-12 h-12 rounded-full transition ${
                      favoriteIds.has(item.id)
                        ? "bg-red-600 text-white"
                        : "bg-[#F4F1EC] text-black"
                    }`}
                  >
                    {favoriteIds.has(item.id) ? "♥" : "♡"}
                  </button>
                </div>

                <p className="text-neutral-500 leading-7 mt-4">
                  {item.description}
                </p>

                <div className="flex flex-col gap-3 mt-8 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    to={`/product/${item.id}`}
                    className="rounded-full border border-black/10 bg-white px-6 py-3 text-black transition hover:bg-black hover:text-white"
                  >
                    View Details
                  </Link>

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
          ))}
        </div>
      </section>

      {/* MOBILE APP SECTION */}
      <section
        id="mobile"
        className="py-28 px-8 lg:px-20 bg-[#ECE7E1]"
      >
        <div className="text-center mb-20">
          <p className="uppercase tracking-[0.3em] text-sm text-neutral-500 mb-5">
            Mobile Experience
          </p>

          <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-none">
            Furniture Shopping
            <br />
            Mobile App
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-10">
          {[1, 2, 3].map((phone) => (
            <div
              key={phone}
              className="w-[320px] bg-[#F7F5F2] rounded-[55px] p-5 shadow-2xl"
            >
              <div className="bg-[#EFEAE4] rounded-[45px] overflow-hidden p-6">
                <h3 className="text-4xl font-black leading-tight tracking-tight mb-8">
                  Create Your
                  <br />
                  Perfect Home
                  <br />
                  Vibe
                </h3>

                <img
                  src="https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=1200&auto=format&fit=crop"
                  alt="Chair"
                  className="h-[300px] w-full object-cover rounded-[30px]"
                />

                <div className="mt-6 flex justify-between items-center">
                  <div>
                    <h4 className="text-2xl font-bold">
                      Solace Chair
                    </h4>

                    <p className="text-neutral-500 mt-1">
                      {formatINR(products[0].price)}
                    </p>
                  </div>

                  <button className="w-14 h-14 rounded-full bg-black text-white text-xl">
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="px-8 lg:px-20 py-28">
        <div className="bg-black text-white rounded-[60px] p-12 md:p-24 text-center">
          <h2 className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-8">
            Furnish Your
            <br />
            Space With Style
          </h2>

          <p className="text-neutral-300 text-lg leading-8 mb-10 max-w-2xl mx-auto">
            Explore premium furniture crafted for comfort,
            beauty and modern living.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-5 rounded-full text-black w-full md:w-[420px] outline-none"
            />

            <button className="bg-white text-black px-10 py-5 rounded-full font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        id="contact"
        className="border-t border-black/10 py-12 px-8 lg:px-20 bg-[#F4F1EC]"
      >
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-5">
              NIHONYA
            </h2>

            <p className="max-w-md text-neutral-500 leading-8">
              Modern Japanese furniture crafted for premium Indian homes.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 text-sm">
            <div className="space-y-4">
              <h4 className="font-semibold">Products</h4>
              <p>Chairs</p>
              <p>Sofas</p>
              <p>Tables</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <p>About</p>
              <p>Stores</p>
              <p>Careers</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <p>Help Center</p>
              <p>Shipping</p>
              <p>Contact</p>
            </div>
          </div>
        </div>

        <div className="border-t border-black/10 mt-10 pt-8 flex flex-col md:flex-row justify-between text-neutral-500 text-sm gap-4">
          <p>© 2026 NIHONYA. All Rights Reserved.</p>
          <p>Create Your Perfect Home Vibe.</p>
        </div>
      </footer>
    </div>
  );
}