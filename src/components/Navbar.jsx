import { Link, useNavigate } from "react-router-dom";
import nihonya_logo from "../assets/nihonya_logo.png";
import { useAuth } from "../src/context/AuthContext";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onDocClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleSignOut = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

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

        <div className="flex items-center gap-4 relative" ref={navRef}>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setOpen((s) => !s)}
                className="flex items-center gap-2 text-sm font-medium transition hover:text-black/70"
                aria-expanded={open}
              >
                <span>{user.username || "Account"}</span>
                <span className="text-xs">▾</span>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg py-2 z-50">
                  <Link to="/orders" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Orders
                  </Link>
                  <Link to="/addresses" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Addresses
                  </Link>
                  <Link to="/account" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Account
                  </Link>
                  <Link to="/contact" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Contact
                  </Link>
                  <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Sign out</button>
                </div>
              )}
            </div>
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
