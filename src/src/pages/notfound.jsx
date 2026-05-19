import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F1EC] p-6">
      <div className="w-full max-w-lg bg-white p-10 rounded-3xl shadow-lg text-center">
        <h1 className="text-5xl font-black mb-4">404</h1>
        <p className="text-lg text-neutral-600 mb-6">Sorry, we couldn't find that page.</p>
        <Link to="/" className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-900 transition">
          Back to home
        </Link>
      </div>
    </div>
  );
}
