import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";

export default function Cart() {
  const {
    cartItems,
    subtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const formatINR = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen bg-[#F4F1EC] pt-28 p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h1 className="text-6xl font-black">Shopping Cart</h1>
        <div className="flex gap-4">
          <Link
            to="/products"
            className="rounded-full bg-white px-6 py-3 text-black shadow-sm"
          >
            Continue Shopping
          </Link>
          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="rounded-full bg-red-500 px-6 py-3 text-white"
            >
              Clear Cart
            </button>
          )}
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="mt-16 rounded-[40px] bg-white p-12 text-center shadow-xl">
          <h2 className="text-4xl font-black mb-4">Your cart is empty</h2>
          <p className="text-neutral-500 mb-8">
            Add a few products from the shop to get started.
          </p>
          <Link
            to="/products"
            className="rounded-full bg-black px-10 py-4 text-white"
          >
            Shop Products
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-8">
          <div className="rounded-[40px] bg-white p-8 shadow-xl">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="grid gap-6 border-b border-black/5 pb-6 last:border-b-0 last:pb-0 sm:grid-cols-[180px_1fr]"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-44 w-full rounded-[30px] object-cover"
                />

                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="text-3xl font-bold">{item.name}</h2>
                    <p className="text-neutral-500 mt-3">{item.description}</p>
                    <p className="mt-4 text-lg font-semibold">{formatINR(item.price)}</p>
                  </div>

                  <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 rounded-full bg-[#F4F1EC] p-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-10 w-10 rounded-full bg-white text-xl"
                      >
                        −
                      </button>
                      <span className="min-w-[38px] text-center text-lg font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-10 w-10 rounded-full bg-white text-xl"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[40px] bg-white p-10 shadow-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
                  Order Summary
                </p>
                <h2 className="text-4xl font-black">Subtotal</h2>
              </div>
              <span className="text-4xl font-black">{formatINR(subtotal)}</span>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
              <Link
                to="/checkout"
                className="rounded-full bg-black px-10 py-5 text-white"
              >
                Proceed to Checkout
              </Link>
              <p className="text-neutral-500">
                Free shipping on orders over ₹5,000.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}