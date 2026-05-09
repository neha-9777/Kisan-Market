import { useEffect, useContext } from "react";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function FarmerDashboard() {
  const { user } = useContext(AuthContext);
  const products = [
    { id: 1, name: "Tomato", price: 20, quantity: 100, sold: 45 },
    { id: 2, name: "Potato", price: 15, quantity: 200, sold: 120 }
  ];

  // Redirect vendors or show error if not farmer
  useEffect(() => {
    if (user && user.role !== "farmer") {
      alert("Access denied. Only farmers can access this page.");
      window.location.href = "/";
    }
  }, [user]);

  if (!user || user.role !== "farmer") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Only farmers can access this dashboard.</p>
          <Link to="/">
            <Button text="Go Home" />
          </Link>
        </div>
      </div>
    );
  }

  const getTotalRevenue = () => {
    return products.reduce((total, p) => total + (p.price * p.sold), 0);
  };

  const getTotalSold = () => {
    return products.reduce((total, p) => total + p.sold, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-600 text-white py-8 px-6">
        <h1 className="text-3xl font-bold">🌾 Farmer Dashboard</h1>
        <p className="opacity-90">Welcome back, {user.name}!</p>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">₹{getTotalRevenue()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Total Sold</p>
            <p className="text-3xl font-bold text-green-600">{getTotalSold()} units</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Total Products</p>
            <p className="text-3xl font-bold text-green-600">{products.length}</p>
          </div>
        </div>

        {/* Add Product Button */}
        <div className="mb-8">
          <Link to="/add-product">
            <Button text="+ Add New Product" />
          </Link>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Product Name</th>
                <th className="px-6 py-4 text-left font-semibold">Price</th>
                <th className="px-6 py-4 text-left font-semibold">Quantity Available</th>
                <th className="px-6 py-4 text-left font-semibold">Sold</th>
                <th className="px-6 py-4 text-left font-semibold">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4">₹{product.price}</td>
                  <td className="px-6 py-4">{product.quantity} kg</td>
                  <td className="px-6 py-4">{product.sold} units</td>
                  <td className="px-6 py-4 font-semibold text-green-600">₹{product.price * product.sold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FarmerDashboard;