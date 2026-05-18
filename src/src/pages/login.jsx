import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (!username) return alert("Enter a username");
    login(username);
    navigate("/account");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F1EC] p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-4">Sign in</h2>

        <label className="block mb-2 text-sm">Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mb-4 px-4 py-3 border rounded" />

        <label className="block mb-2 text-sm">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-6 px-4 py-3 border rounded" />

        <div className="flex justify-between items-center">
          <button className="bg-black text-white px-6 py-3 rounded">Sign in</button>
          <a className="text-sm text-neutral-500" href="#">Forgot?</a>
        </div>
      </form>
    </div>
  );
}
