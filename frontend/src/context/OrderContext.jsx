/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";

export const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

  // Load orders from localStorage on app start
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Save orders to localStorage when orders change
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('orders', JSON.stringify(orders));
    }
  }, [orders]);

  const addOrder = (orderData) => {
    const newOrder = {
      id: `ORD${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      items: orderData.items,
      total: orderData.total,
      status: "Pending",
      itemDetails: orderData.itemDetails
    };
    setOrders([...orders, newOrder]);
    return newOrder;
  };

  return (
    <OrderContext.Provider value={{ orders, setOrders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
}
