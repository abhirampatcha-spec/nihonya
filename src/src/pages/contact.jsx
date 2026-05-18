import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const stored = JSON.parse(localStorage.getItem("nihonya-contacts")) || [];
    stored.push({ id: Date.now(), name, email, message, date: new Date().toISOString() });
    localStorage.setItem("nihonya-contacts", JSON.stringify(stored));
    setName(""); setEmail(""); setMessage("");
    alert("Thanks — your message was saved locally (mock).");
  };

  return (
    <div className="p-12">
      <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
      <form onSubmit={submit} className="max-w-lg">
        <label className="block mb-2">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mb-4 px-4 py-2 border rounded" />

        <label className="block mb-2">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-4 px-4 py-2 border rounded" />

        <label className="block mb-2">Message</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full mb-4 px-4 py-2 border rounded" rows={6} />

        <button className="bg-black text-white px-6 py-3 rounded">Send</button>
      </form>
    </div>
  );
}
