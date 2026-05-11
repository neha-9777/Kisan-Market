import express from "express";

import {
  createOrder,
  getOrders,
  getOrderById,
} from "../controllers/orderController.js";

const router = express.Router();

// Create Order
router.post("/", createOrder);

// Get All Orders
router.get("/", getOrders);

// Get Single Order
router.get("/:id", getOrderById);

export default router;
