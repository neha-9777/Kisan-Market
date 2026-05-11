import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

import Button from "../components/Button";
import PaymentButton from "../components/PaymentButton";

function Orders() {
  const { cart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-green-600 text-white py-8 px-6">
          <h1 className="text-3xl font-bold">Your Orders</h1>
        </div>

        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-lg p-8 text-center shadow">
            <p className="text-xl text-gray-600 mb-4">
              Please login to continue.
            </p>

            <Button
              text="Login"
              onClick={() => (window.location.href = "/login")}
            />
          </div>
        </div>
      </div>
    );
  }

  // Total Amount
  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-green-600 text-white py-8 px-6">
        <h1 className="text-3xl font-bold">Checkout</h1>

        <p className="mt-2 text-green-100">
          Welcome {user.name}
        </p>
      </div>

      <div className="max-w-6xl mx-auto p-6">

        {/* Empty Cart */}
        {cart.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center shadow">
            <p className="text-xl text-gray-600 mb-4">
              Your cart is empty
            </p>

            <Button
              text="Shop Products"
              onClick={() => (window.location.href = "/products")}
            />
          </div>
        ) : (
          <>
            {/* Cart Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">

              <table className="w-full">

                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left font-semibold">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left font-semibold">
                      Quantity
                    </th>

                    <th className="px-6 py-4 text-left font-semibold">
                      Total
                    </th>

                    <th className="px-6 py-4 text-left font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {cart.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50"
                    >

                      {/* Product */}
                      <td className="px-6 py-4 flex items-center gap-4">

                        <img
                          src={
                            item.image ||
                            "https://via.placeholder.com/80"
                          }
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />

                        <div>
                          <p className="font-semibold">
                            {item.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            {item.category}
                          </p>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        ₹{item.price}
                      </td>

                      {/* Quantity */}
                      <td className="px-6 py-4">
                        {item.quantity}
                      </td>

                      {/* Total */}
                      <td className="px-6 py-4 font-semibold text-green-600">
                        ₹{item.price * item.quantity}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                          Pending
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Checkout Section */}
            <div className="bg-white rounded-lg shadow mt-8 p-6">

              <h2 className="text-2xl font-bold mb-6">
                Order Summary
              </h2>

              <div className="flex justify-between items-center mb-4">
                <span className="text-lg">
                  Total Items
                </span>

                <span className="font-semibold">
                  {cart.length}
                </span>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold">
                  Total Amount
                </span>

                <span className="text-3xl font-bold text-green-600">
                  ₹{totalAmount}
                </span>
              </div>

              {/* Payment Button */}
              <PaymentButton amount={totalAmount} />

            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Orders;