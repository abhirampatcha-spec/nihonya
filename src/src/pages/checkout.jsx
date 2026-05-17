import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";

export default function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart();
  const [form, setForm] = useState({ name: "", address: "", phone: "" });

  const formatINR = (value) => `₹${Number(value).toLocaleString("en-IN")}`;
  const bankOffers = [
    { label: "HDFC Bank", discount: "5% off" },
    { label: "ICICI Bank", discount: "4% cashback" },
    { label: "SBI Card", discount: "EMI 6 months" },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name || !form.address || !form.phone) return;
    clearCart();
    alert("Order placed successfully! Thank you for shopping with Nihonya.");
  };

  return (
    <div className="min-h-screen bg-[#F4F1EC] pt-28 p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-6xl font-black mb-4">Checkout</h1>
          <p className="text-neutral-600 max-w-2xl">
            Complete your purchase with secure shipping information and payment.
          </p>
        </div>
        <Link
          to="/cart"
          className="rounded-full bg-white px-6 py-3 text-black shadow-sm"
        >
          Back to Cart
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="mt-16 rounded-[40px] bg-white p-12 text-center shadow-xl">
          <h2 className="text-4xl font-black mb-4">No items in checkout</h2>
          <p className="text-neutral-500 mb-8">
            Add products to your cart before checking out.
          </p>
          <Link
            to="/products"
            className="rounded-full bg-black px-10 py-4 text-white"
          >
            Shop Products
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[40px] bg-white p-10 shadow-xl"
          >
            <h2 className="text-4xl font-black mb-8">Shipping Details</h2>
            <label className="block mb-5">
              <span className="text-sm text-neutral-500">Full Name</span>
              <input
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                type="text"
                className="mt-3 w-full rounded-3xl border border-black/10 bg-[#F4F1EC] px-5 py-4 outline-none"
                placeholder="Your full name"
              />
            </label>

            <label className="block mb-5">
              <span className="text-sm text-neutral-500">Address</span>
              <input
                value={form.address}
                onChange={(event) =>
                  setForm({ ...form, address: event.target.value })
                }
                type="text"
                className="mt-3 w-full rounded-3xl border border-black/10 bg-[#F4F1EC] px-5 py-4 outline-none"
                placeholder="Street, city, postal code"
              />
            </label>

            <label className="block mb-5">
              <span className="text-sm text-neutral-500">Phone Number</span>
              <input
                value={form.phone}
                onChange={(event) =>
                  setForm({ ...form, phone: event.target.value })
                }
                type="tel"
                className="mt-3 w-full rounded-3xl border border-black/10 bg-[#F4F1EC] px-5 py-4 outline-none"
                placeholder="+123 456 7890"
              />
            </label>

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-black px-10 py-5 text-white text-lg font-semibold"
            >
              Pay {formatINR(subtotal)}
            </button>
          </form>

          <div className="rounded-[40px] bg-white p-10 shadow-xl">
            <h2 className="text-4xl font-black mb-6">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-3xl bg-[#F4F1EC] p-4"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-black">{formatINR(item.quantity * item.price)}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 grid gap-3">
              {bankOffers.map((offer) => (
                <div key={offer.label} className="rounded-3xl bg-[#111] p-4 text-white">
                  <p className="font-semibold">{offer.label}</p>
                  <p className="text-sm text-neutral-300 mt-1">{offer.discount}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-3xl bg-black p-8 text-white">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatINR(subtotal)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}