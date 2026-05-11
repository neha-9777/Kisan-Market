import { Link, NavLink, useNavigate } from "react-router-dom";
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
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `hover:opacity-90 transition ${isActive ? "text-yellow-200 font-semibold underline underline-offset-4" : ""}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `hover:opacity-90 transition ${isActive ? "text-yellow-200 font-semibold underline underline-offset-4" : ""}`
          }
        >
          Products
        </NavLink>

        {user?.role === "farmer" && (
          <>
            <NavLink
              to="/farmer"
              className={({ isActive }) =>
                `hover:opacity-90 transition ${isActive ? "text-yellow-200 font-semibold underline underline-offset-4" : ""}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/my-products"
              className={({ isActive }) =>
                `hover:opacity-90 transition ${isActive ? "text-yellow-200 font-semibold underline underline-offset-4" : ""}`
              }
            >
              My Products
            </NavLink>
          </>
        )}

        {user?.role === "vendor" && (
          <span className="text-sm opacity-75">🛒 Vendor</span>
        )}

        {user?.role === "vendor" && (
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative hover:opacity-90 transition ${isActive ? "text-yellow-200 font-semibold underline underline-offset-4" : ""}`
            }
          >
            🛒 Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </NavLink>
        )}

        <Link to="/chat" className="hover:opacity-90 transition">AI Chat</Link>
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
          <NavLink
            to="/"
            end
            className={({ isActive }) => `block hover:opacity-90 ${isActive ? "font-semibold underline underline-offset-4" : ""}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) => `block hover:opacity-90 ${isActive ? "font-semibold underline underline-offset-4" : ""}`}
          >
            Products
          </NavLink>

          {user?.role === "farmer" && (
            <>
              <NavLink
                to="/farmer"
                className={({ isActive }) => `block hover:opacity-90 ${isActive ? "font-semibold underline underline-offset-4" : ""}`}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/my-products"
                className={({ isActive }) => `block hover:opacity-90 ${isActive ? "font-semibold underline underline-offset-4" : ""}`}
              >
                My Products
              </NavLink>
            </>
          )}
          {user?.role === "vendor" && (
            <span className="block text-sm opacity-75">🛒 Vendor Account</span>
          )}

          {user?.role === "vendor" && (
            <NavLink
              to="/cart"
              className={({ isActive }) => `block hover:opacity-90 ${isActive ? "font-semibold underline underline-offset-4" : ""}`}
            >
              Cart ({cart.length})
            </NavLink>
          )}
          {user && (
            <NavLink
              to="/orders"
              className={({ isActive }) => `block hover:opacity-90 ${isActive ? "font-semibold underline underline-offset-4" : ""}`}
            >
              Orders
            </NavLink>
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