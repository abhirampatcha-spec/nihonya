import { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("nihonya-orders")) || [];
      setOrders(stored);
    } catch (e) {
      setOrders([]);
    }
  }, []);

  if (orders.length === 0) {
    return (
      <div className="p-12">
        <h2 className="text-2xl font-bold mb-4">Orders</h2>
        <p>No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="p-12">
      <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
      <div className="space-y-4">
        {orders.map((o, idx) => (
          <div key={idx} className="p-4 border rounded">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">Order #{o.id || idx + 1}</div>
                <div className="text-sm text-neutral-500">{o.date}</div>
              </div>
              <div className="font-black">{o.total ? `₹${o.total}` : "--"}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
