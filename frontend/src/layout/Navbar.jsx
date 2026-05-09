import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center p-4 bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
      <Link to="/" className="text-2xl font-bold hover:opacity-90 transition">
        🚜 KisanMarket
      </Link>

      <div className="hidden md:flex gap-6 items-center">
        <Link to="/" className="hover:opacity-90 transition">Home</Link>
        <Link to="/products" className="hover:opacity-90 transition">Products</Link>

        {/* Show Farmer link only for farmers */}
        {user?.role === "farmer" && (
          <Link to="/farmer" className="hover:opacity-90 transition">Dashboard</Link>
        )}

        {/* Show Vendor link only for vendors */}
        {user?.role === "vendor" && (
          <span className="text-sm opacity-75">🛒 Vendor</span>
        )}

        {user?.role === "vendor" && (
          <Link to="/cart" className="relative hover:opacity-90 transition">
            🛒 Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>
        )}

        {user?.role === "farmer" && (
          <Link to="/farmer" className="hover:opacity-90 transition">My Products</Link>
        )}

        {user && (
          <Link to="/orders" className="hover:opacity-90 transition">Orders</Link>
        )}

        {user ? (
          <>
            <span className="text-sm">
              Hi, {user.name} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:opacity-90 transition">Login</Link>
            <Link to="/register" className="bg-white text-green-600 px-4 py-2 rounded font-medium hover:opacity-90 transition">Register</Link>
          </>
        )}
      </div>

      <div className="md:hidden">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-2xl">
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-green-700 p-4 space-y-2 md:hidden">
          <Link to="/" className="block hover:opacity-90">Home</Link>
          <Link to="/products" className="block hover:opacity-90">Products</Link>

          {/* Mobile menu items based on role */}
          {user?.role === "farmer" && (
            <Link to="/farmer" className="block hover:opacity-90">Dashboard</Link>
          )}
          {user?.role === "vendor" && (
            <span className="block text-sm opacity-75">🛒 Vendor Account</span>
          )}

          {user?.role === "vendor" && (
            <Link to="/cart" className="block hover:opacity-90">Cart ({cart.length})</Link>
          )}
          {user?.role === "farmer" && (
            <Link to="/farmer" className="block hover:opacity-90">My Products</Link>
          )}
          {user && (
            <Link to="/orders" className="block hover:opacity-90">Orders</Link>
          )}
          {user ? (
            <button onClick={handleLogout} className="block w-full text-left hover:opacity-90">Logout</button>
          ) : (
            <>
              <Link to="/login" className="block hover:opacity-90">Login</Link>
              <Link to="/register" className="block hover:opacity-90">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;