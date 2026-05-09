import api from "./api";

export const getProducts = () => api.get("/products");
export const addProduct = (data) => api.post("/products", data);