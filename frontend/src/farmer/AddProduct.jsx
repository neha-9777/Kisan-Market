import { useState, useContext } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { AuthContext } from "../context/AuthContext";
import { addProduct } from "../services/productService";

function AddProduct() {
  const [form, setForm] = useState({ name: "", price: "", description: "", quantity: "" });
  const [loading, setLoading] = useState(false);
  const { token, user } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.quantity) {
      alert("Please fill all required fields");
      return;
    }
    const authToken = token || localStorage.getItem("token");
    if (!authToken) {
      alert("Session expired or token missing. Please logout and login again.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", parseFloat(form.price));
      formData.append("quantity", parseFloat(form.quantity));
      formData.append("unit", "kg");
      formData.append("category", "vegetables");

      await addProduct(formData);
      alert("Product added successfully!");
      setForm({ name: "", price: "", description: "", quantity: "" });
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-600 text-white py-8 px-6">
        <h1 className="text-3xl font-bold">Add New Product</h1>
      </div>
      
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
              <Input
                name="name"
                placeholder="Enter product name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                <Input
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity (kg) *</label>
                <Input
                  type="number"
                  name="quantity"
                  placeholder="Enter quantity"
                  value={form.quantity}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                placeholder="Enter product description"
                value={form.description}
                onChange={handleChange}
                className="border border-gray-300 p-3 w-full rounded focus:ring-2 focus:ring-green-600 focus:border-transparent"
                rows="4"
              />
            </div>
            
            <Button text={loading ? "Adding..." : "Add Product"} className="w-full" disabled={loading} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;