import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function ProductCard({ product, onAdd }) {
  const { user } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (value) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddWithQuantity = () => {
    onAdd(product, quantity);
    setQuantity(1);
  };

  const renderActionButton = () => {
    if (!user) {
      // Guest user
      return (
        <button
          onClick={() => window.location.href = "/login"}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-2 rounded w-full font-medium transition-colors"
        >
          Login to Buy
        </button>
      );
    }

    if (user.role === "farmer") {
      // Farmer - show different action (maybe edit or view details)
      return (
        <div className="mt-2 space-y-2">
          <button
            onClick={() => alert("View product details")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-medium transition-colors"
          >
            View Details
          </button>
          <p className="text-sm text-gray-600 text-center">🌾 Farmers sell products</p>
        </div>
      );
    }

    if (user.role === "vendor") {
      // Vendor - can add to cart with quantity
      return (
        <div className="mt-2 space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Qty:</label>
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded font-medium"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-12 text-center border border-gray-300 rounded py-1"
              min="1"
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded font-medium"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAddWithQuantity}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full font-medium transition-colors"
          >
            Add to Cart
          </button>
        </div>
      );
    }
  };

  return (
    <div className="border border-gray-200 p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
      <img src={product.image} alt={product.name} className="h-40 w-full object-cover rounded mb-3" />
      <h2 className="font-bold text-lg mb-1">{product.name}</h2>
      <p className="text-green-600 font-semibold mb-3">₹{product.price}</p>
      {renderActionButton()}
    </div>
  );
}

export default ProductCard;