import { useState, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Upload, X, CheckCircle, AlertCircle, Leaf, MapPin, Package, DollarSign, ShoppingCart } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { AuthContext } from "../context/AuthContext";
import { addProduct } from "../services/productService";

function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    discountPrice: "",
    description: "",
    quantity: "",
    minOrderQuantity: "",
    unit: "kg",
    category: "Fruits",
    productType: "Fresh",
    stockStatus: "In Stock",
    location: "",
    organic: false,
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { token, user } = useContext(AuthContext);

  const categories = ["Fruits", "Vegetables", "Grains", "Seeds", "Dairy", "Pulses", "Spices", "Organic Products", "Others"];
  const units = ["kg", "gram", "piece", "dozen", "litre"];
  const productTypes = ["Fresh", "Processed", "Packaged", "Frozen"];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...acceptedFiles]
      }));
    }
  });

  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.price || form.price <= 0) newErrors.price = "Valid price is required";
    if (form.discountPrice && (form.discountPrice < 0 || form.discountPrice >= form.price)) {
      newErrors.discountPrice = "Discount price must be less than regular price";
    }
    if (!form.quantity || form.quantity <= 0) newErrors.quantity = "Valid quantity is required";
    if (!form.minOrderQuantity || form.minOrderQuantity <= 0) newErrors.minOrderQuantity = "Minimum order quantity is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (form.images.length === 0) newErrors.images = "At least one image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    const authToken = token || localStorage.getItem("token");
    if (!authToken) {
      toast.error("Session expired. Please login again.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", parseFloat(form.price));
      formData.append("discountPrice", form.discountPrice ? parseFloat(form.discountPrice) : "");
      formData.append("quantity", parseFloat(form.quantity));
      formData.append("minOrderQuantity", parseFloat(form.minOrderQuantity));
      formData.append("unit", form.unit);
      formData.append("category", form.category);
      formData.append("productType", form.productType);
      formData.append("stockStatus", form.stockStatus);
      formData.append("location", form.location);
      formData.append("organic", form.organic);
      formData.append("farmerId", user?.id || "");
      formData.append("farmerName", user?.name || "");

      form.images.forEach((image, index) => {
        formData.append("images", image);
      });

      await addProduct(formData);
      toast.success("Product added successfully!");
      handleReset();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      name: "",
      price: "",
      discountPrice: "",
      description: "",
      quantity: "",
      minOrderQuantity: "",
      unit: "kg",
      category: "Fruits",
      productType: "Fresh",
      stockStatus: "In Stock",
      location: "",
      organic: false,
      images: []
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-green-600 text-white py-8 px-6 shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package className="w-8 h-8" />
          Add New Product
        </h1>
      </div>
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Product Images */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-green-600" />
                Product Images *
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-green-400 hover:bg-green-50"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-green-600 font-medium">Drop the images here...</p>
                ) : (
                  <p className="text-gray-600">
                    Drag & drop images here, or click to select files
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-2">Supported formats: JPEG, PNG, GIF</p>
              </div>
              {errors.images && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.images}</p>}
              
              {/* Image Preview */}
              {form.images.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {form.images.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <Input
                  name="name"
                  placeholder="Enter product name"
                  value={form.name}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Regular Price (₹) *
                </label>
                <Input
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  value={form.price}
                  onChange={handleChange}
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.price}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Price (₹)</label>
                <Input
                  type="number"
                  name="discountPrice"
                  placeholder="Enter discount price (optional)"
                  value={form.discountPrice}
                  onChange={handleChange}
                  className={errors.discountPrice ? "border-red-500" : ""}
                />
                {errors.discountPrice && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.discountPrice}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 w-full rounded focus:ring-2 focus:ring-green-600 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
                <select
                  name="productType"
                  value={form.productType}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 w-full rounded focus:ring-2 focus:ring-green-600 focus:border-transparent"
                >
                  {productTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Status</label>
                <select
                  name="stockStatus"
                  value={form.stockStatus}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 w-full rounded focus:ring-2 focus:ring-green-600 focus:border-transparent"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                <Input
                  type="number"
                  name="quantity"
                  placeholder="Enter quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  className={errors.quantity ? "border-red-500" : ""}
                />
                {errors.quantity && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.quantity}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <select
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 w-full rounded focus:ring-2 focus:ring-green-600 focus:border-transparent"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <ShoppingCart className="w-4 h-4" />
                  Minimum Order Quantity *
                </label>
                <Input
                  type="number"
                  name="minOrderQuantity"
                  placeholder="Enter minimum order quantity"
                  value={form.minOrderQuantity}
                  onChange={handleChange}
                  className={errors.minOrderQuantity ? "border-red-500" : ""}
                />
                {errors.minOrderQuantity && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.minOrderQuantity}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Location (Village/City) *
                </label>
                <Input
                  name="location"
                  placeholder="Enter your location"
                  value={form.location}
                  onChange={handleChange}
                  className={errors.location ? "border-red-500" : ""}
                />
                {errors.location && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.location}</p>}
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

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="organic"
                name="organic"
                checked={form.organic}
                onChange={handleChange}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="organic" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Leaf className="w-4 h-4 text-green-600" />
                Organic Product
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Adding Product...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Add Product
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Reset Form
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;