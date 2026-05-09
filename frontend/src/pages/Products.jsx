import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import ProductList from "../product/ProductList";

function Products() {
  const products = [
    { id: 1, name: "Tomato", price: 20, image: "/farmer.png" },
    { id: 2, name: "Potato", price: 15, image: "/farmer.png" },
    { id: 3, name: "Onion", price: 25, image: "/farmer.png" },
    { id: 4, name: "Carrot", price: 30, image: "/farmer.png" }
  ];
  const { user } = useContext(AuthContext);
  const { cart, setCart } = useContext(CartContext);

  const handleAdd = (product, quantity = 1) => {
    if (!user || user.role !== "vendor") return;
    
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setCart(updatedCart);
      alert(`${product.name} quantity updated in cart.`);
      return;
    }

    setCart([...cart, { ...product, quantity }]);
    alert(`${quantity} x ${product.name} added to cart.`);
  };

  const getPageTitle = () => {
    if (!user) return "Fresh Products from Farmers";
    if (user.role === "farmer") return "Market Products - Farmers Manage Their Listings";
    if (user.role === "vendor") return "Fresh Products - Buy from Farmers";
    return "Products";
  };

  const getPageDescription = () => {
    if (!user) return "Browse and buy fresh produce directly from local farmers.";
    if (user.role === "farmer") return "View all products in the market. Manage your own products from your dashboard.";
    if (user.role === "vendor") return "Browse fresh produce from local farmers and add items to your cart.";
    return "";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-600 text-white py-8 px-6">
        <h1 className="text-3xl font-bold">{getPageTitle()}</h1>
        <p className="mt-2 text-green-100">{getPageDescription()}</p>
        {user ? (
          <p className="mt-3 text-green-100 text-sm">
            Logged in as <strong>{user.name}</strong> ({user.role}).
          </p>
        ) : (
          <p className="mt-3 text-green-100 text-sm">
            Please login or register to buy products from farmers.
          </p>
        )}
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <ProductList products={products} onAdd={handleAdd} />
      </div>
    </div>
  );
}

export default Products;