import { useContext } from "react";
import { OrderContext } from "../context/OrderContext";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/Button";

function Orders() {
  const { orders } = useContext(OrderContext);
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-green-600 text-white py-8 px-6">
          <h1 className="text-3xl font-bold">Your Orders</h1>
        </div>
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-xl text-gray-600 mb-4">Please login to view your orders.</p>
            <Button text="Login" onClick={() => window.location.href = "/login"} />
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case "Delivered":
        return "text-green-600 bg-green-100";
      case "Processing":
        return "text-yellow-600 bg-yellow-100";
      case "Pending":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-600 text-white py-8 px-6">
        <h1 className="text-3xl font-bold">Your Orders</h1>
        <p className="mt-2 text-green-100">
          Ordered by {user.name} ({user.role})
        </p>
      </div>
      
      <div className="max-w-6xl mx-auto p-6">
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-xl text-gray-600 mb-4">No orders yet</p>
            <Button text="Start Shopping" onClick={() => window.location.href = "/products"} />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Order ID</th>
                  <th className="px-6 py-4 text-left font-semibold">Date</th>
                  <th className="px-6 py-4 text-left font-semibold">Items</th>
                  <th className="px-6 py-4 text-left font-semibold">Total</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-green-600">{order.id}</td>
                    <td className="px-6 py-4">{order.date}</td>
                    <td className="px-6 py-4 text-sm">{order.items}</td>
                    <td className="px-6 py-4 font-semibold">₹{order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-green-600 hover:text-green-800 font-medium">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;