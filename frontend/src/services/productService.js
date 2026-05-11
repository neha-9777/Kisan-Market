import axios from "axios";

const API = "http://localhost:5000/api/products";

// Get all products
export const getProducts = async () => {
  return await axios.get(API);
};

// Add new product
export const addProduct = async (formData) => {
  return await axios.post(API, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Delete product
export const deleteProduct = async (id) => {
  return await axios.delete(`${API}/${id}`);
};
