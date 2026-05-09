import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getProducts } from "../services/productService";
import ProductCard from "../product/ProductCard";

function MyProducts() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user || user.role !== 'farmer') {
        setError("Access denied. Only farmers can view their products.");
        setLoading(false);
        return;
      }
      try {
        const response = await getProducts();
        const farmerProducts = response.data.filter(product => product.farmerId === user.id);
        setProducts(farmerProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user]);

  if (loading) return <div className="p-6">Loading products...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-green-600 text-white py-8 px-6 mb-6">
        <h1 className="text-3xl font-bold">My Products</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            <p>No products added yet.</p>
            <p>Go to Add Product to add your first product.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProducts;