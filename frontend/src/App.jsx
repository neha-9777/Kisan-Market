import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Orders from "./pages/Order";
import FarmerDashboard from "./farmer/FarmerDashboard";
import MyProducts from "./farmer/MyProduct";
import AddProduct from "./farmer/AddProduct";
import Login from "./auth/Logig";
import Register from "./auth/Register";
import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <div className="flex flex-col min-h-screen">
              {/* Navbar */}
              <Navbar />

            {/* Routes */}
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />

                {/* Farmer Routes - Only for farmers */}
                <Route path="/farmer" element={
                  <ProtectedRoute allowedRoles={["farmer"]}>
                    <FarmerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/my-products" element={
                  <ProtectedRoute allowedRoles={["farmer"]}>
                    <MyProducts />
                  </ProtectedRoute>
                } />
                <Route path="/add-product" element={
                  <ProtectedRoute allowedRoles={["farmer"]}>
                    <AddProduct />
                  </ProtectedRoute>
                } />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </div>

            {/* Footer */}
            <Footer />
          </div>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
  );
}

export default App;