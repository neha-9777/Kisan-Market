import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function ProductCard({ product, onAdd, onDelete }) {
  const { user } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(1);
  const [showDetails, setShowDetails] = useState(false);

  const handleQuantityChange = (value) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddWithQuantity = () => {
    onAdd(product, quantity);
    setQuantity(1);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleDelete = () => {
    if (typeof onDelete === 'function') {
      if (window.confirm(`Delete product "${product.name}"? This cannot be undone.`)) {
        onDelete(product.id || product._id);
      }
    }
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
      // Farmer - show view details and delete button when callback is provided
      return (
        <div className="mt-2 space-y-2">
          <button
            onClick={toggleDetails}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-medium transition-colors"
          >
            {showDetails ? "Hide Details" : "View Details"}
          </button>
          {typeof onDelete === 'function' && (
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full font-medium transition-colors"
            >
              Delete Product
            </button>
          )}
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

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (typeof imagePath !== 'string') return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `http://localhost:5000${imagePath}`;
    return imagePath;
  };

  const displayImage = product.images && product.images.length > 0
    ? product.images[0]?.url || product.images[0]
    : product.image;

  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect fill="%23e5e7eb" width="300" height="200"/%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%23999"%3ENo Image Available%3C/text%3E%3C/svg%3E';
  };

  return (
    <div className="border border-gray-200 p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
      <img src={getImageUrl(displayImage) || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect fill="%23e5e7eb" width="300" height="200"/%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%23999"%3ENo Image Available%3C/text%3E%3C/svg%3E'} alt={product.name} className="h-40 w-full object-cover rounded mb-3" onError={handleImageError} />
      <h2 className="font-bold text-lg mb-1">{product.name}</h2>
      <p className="text-green-600 font-semibold mb-3">₹{product.price}</p>
      {renderActionButton()}
      {showDetails && user && user.role === "farmer" && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <p><strong>Description:</strong> {product.description || "No description available"}</p>
          <p><strong>Quantity:</strong> {product.quantity} {product.unit}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Available:</strong> {product.available ? "Yes" : "No"}</p>
          <p><strong>Farmer:</strong> {product.farmerName}</p>
        </div>
      )}
    </div>
  );
}

export default ProductCard;