import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const isAppleDevice = typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod|Apple/i.test(navigator.userAgent + navigator.platform);

  const submit = (e) => {
    e.preventDefault();
    if (!username || !email) return alert("Enter a username and email to sign up.");
    signup(username, { email, provider: "local" });
    navigate("/account");
  };

  const oauthSignup = (provider) => {
    signup(`${provider} User`, { provider, email: `${provider.toLowerCase()}@example.com` });
    navigate("/account");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F1EC] p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-4">Create your account</h2>

        <button type="button" onClick={() => oauthSignup("Google")} className="w-full mb-3 inline-flex items-center justify-center gap-2 rounded border border-neutral-200 bg-white px-4 py-3 text-sm font-medium transition hover:bg-neutral-50">
          <span>Sign up with Google</span>
        </button>

        {isAppleDevice && (
          <button type="button" onClick={() => oauthSignup("Apple")} className="w-full mb-3 inline-flex items-center justify-center gap-2 rounded border border-neutral-200 bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-900">
            <span>Sign up with Apple</span>
          </button>
        )}

        {!isAppleDevice && (
          <div className="mb-3 rounded border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
            Apple sign-up is shown only on Apple devices.
          </div>
        )}

        <div className="my-4 flex items-center gap-3 text-sm text-neutral-500">
          <span className="h-px flex-1 bg-neutral-200" />
          <span>or sign up with email</span>
          <span className="h-px flex-1 bg-neutral-200" />
        </div>

        <form onSubmit={submit}>
          <label className="block mb-2 text-sm">Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mb-4 px-4 py-3 border rounded" />

          <label className="block mb-2 text-sm">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-4 px-4 py-3 border rounded" />

          <label className="block mb-2 text-sm">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-6 px-4 py-3 border rounded" />

          <button className="w-full bg-black text-white px-6 py-3 rounded">Sign up</button>
        </form>

        <p className="mt-4 text-sm text-neutral-500">
          Already have an account? <a href="/login" className="font-medium text-black">Sign in</a>
        </p>
      </div>
    </div>
  );
}
