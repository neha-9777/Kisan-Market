import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { getProducts } from "../services/productService";
import ProductList from "../product/ProductList";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext);
  const { cart, setCart } = useContext(CartContext);

  const category = searchParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        let fetchedProducts = response.data.data || [];
        
        // Filter by category if specified
        if (category) {
          fetchedProducts = fetchedProducts.filter(p => p.category === category);
        }
        
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

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
    if (category) return `${category} - Fresh from Farmers`;
    if (!user) return "Fresh Products from Farmers";
    if (user.role === "farmer") return "Market Products - Farmers Manage Their Listings";
    if (user.role === "vendor") return "Fresh Products - Buy from Farmers";
    return "Products";
  };

  const getPageDescription = () => {
    if (category) return `Browse ${category.toLowerCase()} directly from local farmers.`;
    if (!user) return "Browse and buy fresh produce directly from local farmers.";
    if (user.role === "farmer") return "View all products in the market. Manage your own products from your dashboard.";
    if (user.role === "vendor") return "Browse fresh produce from local farmers and add items to your cart.";
    return "";
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading products...</div>;
  if (error) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-600 text-white py-8 px-6">
        <h1 className="text-3xl font-bold">{getPageTitle()}</h1>
        <p className="text-green-100 mt-2">{getPageDescription()}</p>
        {category && (
          <p className="text-green-200 mt-1">Showing products in {category} category</p>
        )}
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
      
      {products.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No products found</h2>
          <p className="text-gray-500">
            {category ? `No products available in ${category} category yet.` : "No products available at the moment."}
          </p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-6">
          <ProductList products={products} onAdd={handleAdd} />
        </div>
      )}
    </div>
  );
}

export default Products;