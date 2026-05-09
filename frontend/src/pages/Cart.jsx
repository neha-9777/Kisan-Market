import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { OrderContext } from "../context/OrderContext";
import Button from "../components/Button";

function Cart() {
  const { cart, setCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { addOrder } = useContext(OrderContext);

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(index);
      return;
    }
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    setCart(updatedCart);
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const itemNames = cart.map(item => `${item.quantity || 1}x ${item.name}`).join(", ");
    const orderData = {
      items: itemNames,
      total: getTotalPrice(),
      itemDetails: cart
    };

    addOrder(orderData);
    alert("Order placed successfully!");
    setCart([]);
    window.location.href = "/orders";
  };

  const getPageTitle = () => {
    if (user?.role === "farmer") return "Product Management";
    return "Your Shopping Cart";
  };

  const getPageDescription = () => {
    if (user?.role === "farmer") return "As a farmer, you can manage your products from the dashboard.";
    return "Review your selected fresh produce from local farmers.";
  };

  // If user is a farmer, show different content
  if (user?.role === "farmer") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-green-600 text-white py-8 px-6">
          <h1 className="text-3xl font-bold">{getPageTitle()}</h1>
          <p className="mt-2 text-green-100">{getPageDescription()}</p>
        </div>

        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-lg p-8 text-center shadow">
            <div className="text-6xl mb-4">🌾</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Farmer Dashboard</h2>
            <p className="text-gray-600 mb-6">
              As a farmer, you sell products rather than buy them. Manage your product listings and track sales from your dashboard.
            </p>
            <div className="space-x-4">
              <Button
                text="Go to Dashboard"
                onClick={() => window.location.href = "/farmer"}
                className="bg-green-600 hover:bg-green-700"
              />
              <Button
                text="View All Products"
                onClick={() => window.location.href = "/products"}
                className="bg-blue-600 hover:bg-blue-700"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-green-600 text-white py-8 px-6">
          <h1 className="text-3xl font-bold">Your Shopping Cart</h1>
        </div>
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-xl text-gray-600 mb-4">Please login to view your cart.</p>
            <Button text="Login" onClick={() => window.location.href = "/login"} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-600 text-white py-8 px-6">
        <h1 className="text-3xl font-bold">{getPageTitle()}</h1>
        <p className="mt-2 text-green-100">{getPageDescription()}</p>
        <p className="mt-3 text-green-100 text-sm">
          Logged in as <strong>{user.name}</strong> ({user.role}).
        </p>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {cart.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
            <Button text="Continue Shopping" onClick={() => window.location.href = "/products"} />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left">Product</th>
                    <th className="px-6 py-4 text-left">Price</th>
                    <th className="px-6 py-4 text-left">Quantity</th>
                    <th className="px-6 py-4 text-left">Total</th>
                    <th className="px-6 py-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{item.name}</td>
                      <td className="px-6 py-4">₹{item.price}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(index, (item.quantity || 1) - 1)}
                            className="px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity || 1}</span>
                          <button
                            onClick={() => updateQuantity(index, (item.quantity || 1) + 1)}
                            className="px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">₹{item.price * (item.quantity || 1)}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 bg-white rounded-lg p-6 shadow">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold">Total Price:</span>
                <span className="text-2xl font-bold text-green-600">₹{getTotalPrice()}</span>
              </div>
              <Button text="Place Order" onClick={handlePlaceOrder} className="w-full" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;