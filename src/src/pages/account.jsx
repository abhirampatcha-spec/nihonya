import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Account() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="p-12">
        <h2 className="text-2xl font-bold mb-4">Not signed in</h2>
        <p>Please <Link to="/login" className="underline">sign in</Link> to view your account.</p>
      </div>
    );
  }

  return (
    <div className="p-12">
      <h2 className="text-3xl font-bold mb-4">My Account</h2>
      <p className="mb-6">Signed in as <strong>{user.username}</strong></p>

      <div className="grid gap-3 max-w-md">
        <Link to="/orders" className="p-4 border rounded">Orders</Link>
        <Link to="/addresses" className="p-4 border rounded">My Addresses</Link>
        <Link to="/contact" className="p-4 border rounded">Contact</Link>
        <button onClick={logout} className="p-3 bg-red-600 text-white rounded mt-4">Sign out</button>
      </div>
    </div>
  );
}
