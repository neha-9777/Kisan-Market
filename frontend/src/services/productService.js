import api from "./api";

export const getProducts = () => api.get("/products");
export const addProduct = (data) => api.post("/products", data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);