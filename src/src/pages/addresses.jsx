import { useEffect, useState } from "react";

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    try {
      setAddresses(JSON.parse(localStorage.getItem("nihonya-addresses")) || []);
    } catch (e) {
      setAddresses([]);
    }
  }, []);

  const add = () => {
    if (!value) return;
    const next = [...addresses, { id: Date.now(), text: value }];
    setAddresses(next);
    localStorage.setItem("nihonya-addresses", JSON.stringify(next));
    setValue("");
  };

  return (
    <div className="p-12">
      <h2 className="text-2xl font-bold mb-4">My Addresses</h2>

      <div className="max-w-lg">
        {addresses.length === 0 ? (
          <p className="mb-4 text-neutral-500">No saved addresses.</p>
        ) : (
          <ul className="space-y-2 mb-4">
            {addresses.map((a) => (
              <li key={a.id} className="p-3 border rounded">{a.text}</li>
            ))}
          </ul>
        )}

        <div className="flex gap-2">
          <input value={value} onChange={(e) => setValue(e.target.value)} className="flex-1 px-4 py-2 border rounded" placeholder="Add new address" />
          <button onClick={add} className="px-4 py-2 bg-black text-white rounded">Add</button>
        </div>
      </div>
    </div>
  );
}
