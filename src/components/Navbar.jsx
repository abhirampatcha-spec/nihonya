import { Link } from "react-router-dom";
import nihonya_logo from "../assets/nihonya_logo.png";
import { useAuth } from "../src/context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-black/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">
        <Link to="/" className="flex items-center gap-3">
          <img src={nihonya_logo} alt="Nihonya Logo" className="h-20 w-auto" />
        </Link>

        <div className="hidden md:flex gap-10 text-sm font-medium">
          <Link to="/" className="transition hover:text-black/70">
            Home
          </Link>
          <Link to="/products" className="transition hover:text-black/70">
            Products
          </Link>
          <Link to="/#mobile" className="transition hover:text-black/70">
            Mobile App
          </Link>
          <Link to="/contact" className="transition hover:text-black/70">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <Link to="/account" className="text-sm font-medium transition hover:text-black/70">
              {user.username || "Account"}
            </Link>
          ) : (
            <Link to="/login" className="text-sm font-medium transition hover:text-black/70">
              Login
            </Link>
          )}

          <Link to="/products" className="bg-black text-white px-6 py-3 rounded-full">
            Shop Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
