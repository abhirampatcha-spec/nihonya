import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/useCart";

const bankOffers = [
  {
    id: "hdfc",
    label: "HDFC Bank",
    discountLabel: "5% instant discount",
    percent: 5,
    logo: "HDFC",
    tone: "bg-[#0f172a]",
    caption: "Best savings on checkout",
  },
  {
    id: "icici",
    label: "ICICI Bank",
    discountLabel: "4% cashback",
    percent: 4,
    logo: "ICICI",
    tone: "bg-[#111827]",
    caption: "Cashback credited after purchase",
  },
  {
    id: "sbi",
    label: "SBI Card",
    discountLabel: "0% interest EMI",
    percent: 0,
    logo: "SBI",
    tone: "bg-[#111827]",
    caption: "Flexible EMI option",
  },
];

export default function Checkout() {
  const { user } = useAuth();
  const { cartItems, subtotal, clearCart } = useCart();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [form, setForm] = useState({ name: "", address: "", phone: "" });
  const [selectedOfferId, setSelectedOfferId] = useState(bankOffers[0].id);

  const selectedOffer = useMemo(
    () => bankOffers.find((offer) => offer.id === selectedOfferId) || bankOffers[0],
    [selectedOfferId]
  );

  const discountAmount = useMemo(
    () => Math.round(subtotal * (selectedOffer.percent / 100)),
    [subtotal, selectedOffer]
  );
  const total = subtotal - discountAmount;

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("nihonya-addresses")) || [];
      setSavedAddresses(saved);
      if (saved.length > 0) {
        const defaultAddress = saved[0];
        setSelectedAddressId(defaultAddress.id);
        setForm({
          name: defaultAddress.name || user?.username || "",
          address: `${defaultAddress.flat}, ${defaultAddress.building ? defaultAddress.building + ", " : ""}${defaultAddress.street}, ${defaultAddress.locality ? defaultAddress.locality + ", " : ""}${defaultAddress.city}, ${defaultAddress.state} - ${defaultAddress.pincode}`,
          phone: defaultAddress.phone || "",
        });
      } else if (user && !form.name) {
        setForm((prev) => ({ ...prev, name: user.username || prev.name }));
      }
    } catch (e) {
      setSavedAddresses([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!selectedAddressId) return;
    const selected = savedAddresses.find((item) => item.id === selectedAddressId);
    if (selected) {
      setForm({
        name: selected.name || user?.username || "",
        address: `${selected.flat}, ${selected.building ? selected.building + ", " : ""}${selected.street}, ${selected.locality ? selected.locality + ", " : ""}${selected.city}, ${selected.state} - ${selected.pincode}`,
        phone: selected.phone || "",
      });
    }
  }, [selectedAddressId, savedAddresses, user]);

  const formatINR = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name || !form.address || !form.phone) {
      return alert("Please complete all shipping details before placing the order.");
    }
    clearCart();
    alert(`Order placed successfully! Total paid: ${formatINR(total)}`);
  };

  const addressOptions = savedAddresses.map((item) => ({
    id: item.id,
    label: `${item.label} — ${item.flat}, ${item.city}`,
  }));

  return (
    <div className="min-h-screen bg-[#F4F1EC] pt-28 p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-6xl font-black mb-4">Checkout</h1>
          <p className="text-neutral-600 max-w-2xl">
            Review your shipping details, select the best bank offer, and complete your order.
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

            {savedAddresses.length > 0 && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-neutral-600 mb-3">
                  Select saved address
                </label>
                <select
                  value={selectedAddressId ?? ""}
                  onChange={(event) => setSelectedAddressId(Number(event.target.value))}
                  className="w-full rounded-3xl border border-black/10 bg-[#F4F1EC] px-5 py-4 outline-none"
                >
                  {addressOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <label className="block mb-5">
              <span className="text-sm text-neutral-500">Full Name</span>
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                type="text"
                className="mt-3 w-full rounded-3xl border border-black/10 bg-[#F4F1EC] px-5 py-4 outline-none"
                placeholder="Your full name"
              />
            </label>

            <label className="block mb-5">
              <span className="text-sm text-neutral-500">Shipping Address</span>
              <textarea
                value={form.address}
                onChange={(event) => setForm({ ...form, address: event.target.value })}
                className="mt-3 w-full rounded-3xl border border-black/10 bg-[#F4F1EC] px-5 py-4 outline-none resize-none min-h-[140px]"
                placeholder="Flat / House no., Building, Street, City, State, Pincode"
              />
            </label>

            <label className="block mb-5">
              <span className="text-sm text-neutral-500">Phone Number</span>
              <input
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                type="tel"
                className="mt-3 w-full rounded-3xl border border-black/10 bg-[#F4F1EC] px-5 py-4 outline-none"
                placeholder="+91 98765 43210"
              />
            </label>

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-black px-10 py-5 text-white text-lg font-semibold"
            >
              Pay {formatINR(total)}
            </button>
          </form>

          <div className="rounded-[40px] bg-white p-10 shadow-xl">
            <h2 className="text-4xl font-black mb-6">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 rounded-3xl bg-[#F4F1EC] p-4">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-black">{formatINR(item.quantity * item.price)}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 mb-4">
                Bank offers
              </p>
              <div className="space-y-3">
                {bankOffers.map((offer) => (
                  <button
                    key={offer.id}
                    type="button"
                    onClick={() => setSelectedOfferId(offer.id)}
                    className={`w-full rounded-3xl border px-4 py-4 text-left transition ${
                      selectedOfferId === offer.id ? "border-black bg-black text-white" : "border-black/10 bg-[#F4F1EC] text-black"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold">{offer.label}</p>
                        <p className="text-sm mt-1 text-neutral-500">{offer.discountLabel}</p>
                      </div>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white ${offer.tone}`}>
                        {offer.logo}
                      </div>
                    </div>
                    <p className="text-sm mt-3 text-neutral-500">{offer.caption}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-black/10 bg-[#F4F1EC] p-6">
              <div className="flex items-center justify-between text-sm text-neutral-600 mb-3">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-neutral-600 mb-3">
                <span>Discount</span>
                <span>-{formatINR(discountAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-neutral-600 mb-3">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-xl font-semibold">
                <span>Total payable</span>
                <span>{formatINR(total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
