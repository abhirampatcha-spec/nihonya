import { useEffect, useState } from "react";

const emptyAddress = {
  label: "Home",
  name: "",
  phone: "",
  flat: "",
  building: "",
  street: "",
  locality: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  landmark: "",
};

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState(emptyAddress);

  useEffect(() => {
    try {
      setAddresses(JSON.parse(localStorage.getItem("nihonya-addresses")) || []);
    } catch (e) {
      setAddresses([]);
    }
  }, []);

  const saveAddresses = (next) => {
    setAddresses(next);
    localStorage.setItem("nihonya-addresses", JSON.stringify(next));
  };

  const onChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const add = () => {
    const required = ["name", "phone", "flat", "street", "city", "state", "pincode"];
    const missing = required.filter((field) => !address[field]?.trim());
    if (missing.length) {
      return alert("Please fill all required fields: " + missing.join(", "));
    }

    const next = [...addresses, { id: Date.now(), ...address }];
    saveAddresses(next);
    setAddress(emptyAddress);
  };

  const remove = (id) => {
    const next = addresses.filter((item) => item.id !== id);
    saveAddresses(next);
  };

  return (
    <div className="p-12">
      <h2 className="text-2xl font-bold mb-4">My Addresses</h2>
      <p className="mb-8 text-neutral-600 max-w-2xl">Save a professional address format with flat/house number, building name, street, locality, city, state, pincode and country.</p>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <label className="block text-sm font-medium">Address label</label>
              <label className="block text-sm font-medium">Contact name</label>
              <select value={address.label} onChange={(e) => onChange("label", e.target.value)} className="w-full rounded border px-4 py-3">
                <option>Home</option>
                <option>Work</option>
                <option>Other</option>
              </select>
              <input value={address.name} onChange={(e) => onChange("name", e.target.value)} placeholder="Full name" className="w-full rounded border px-4 py-3" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="block text-sm font-medium">Phone number</label>
              <label className="block text-sm font-medium">Flat / House no.</label>
              <input value={address.phone} onChange={(e) => onChange("phone", e.target.value)} placeholder="Mobile number" className="w-full rounded border px-4 py-3" />
              <input value={address.flat} onChange={(e) => onChange("flat", e.target.value)} placeholder="Flat / House no." className="w-full rounded border px-4 py-3" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="block text-sm font-medium">Building / Apartment</label>
              <label className="block text-sm font-medium">Road / Street</label>
              <input value={address.building} onChange={(e) => onChange("building", e.target.value)} placeholder="Building name" className="w-full rounded border px-4 py-3" />
              <input value={address.street} onChange={(e) => onChange("street", e.target.value)} placeholder="Road / Street" className="w-full rounded border px-4 py-3" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="block text-sm font-medium">Locality / Landmark</label>
              <label className="block text-sm font-medium">City</label>
              <input value={address.locality} onChange={(e) => onChange("locality", e.target.value)} placeholder="Locality / Landmark" className="w-full rounded border px-4 py-3" />
              <input value={address.city} onChange={(e) => onChange("city", e.target.value)} placeholder="City" className="w-full rounded border px-4 py-3" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <label className="block text-sm font-medium">State</label>
              <label className="block text-sm font-medium">Pincode</label>
              <label className="block text-sm font-medium">Country</label>
              <input value={address.state} onChange={(e) => onChange("state", e.target.value)} placeholder="State" className="w-full rounded border px-4 py-3" />
              <input value={address.pincode} onChange={(e) => onChange("pincode", e.target.value)} placeholder="Pincode" className="w-full rounded border px-4 py-3" />
              <input value={address.country} onChange={(e) => onChange("country", e.target.value)} placeholder="Country" className="w-full rounded border px-4 py-3" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={add} className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-white transition hover:bg-neutral-900">
              Save address
            </button>
            <button onClick={() => setAddress(emptyAddress)} className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-6 py-3 text-sm text-neutral-700 hover:bg-neutral-100">
              Clear form
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Saved Addresses</h3>
          {addresses.length === 0 ? (
            <p className="text-neutral-500">No saved addresses yet. Add one using the form.</p>
          ) : (
            <div className="space-y-4">
              {addresses.map((item) => (
                <div key={item.id} className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div>
                      <p className="font-semibold">{item.label} address</p>
                      <p className="text-sm text-neutral-500">{item.name} · {item.phone}</p>
                    </div>
                    <button onClick={() => remove(item.id)} className="text-sm text-red-600 hover:underline">Remove</button>
                  </div>
                  <p className="text-sm leading-6 text-neutral-700">
                    {item.flat}, {item.building}{item.building ? ", " : ""}{item.street}
                    <br />
                    {item.locality}{item.locality ? ", " : ""}{item.city}, {item.state} {item.pincode}
                    <br />
                    {item.country}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
