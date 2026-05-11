import express from "express";
import { getFarmerProducts, updateProduct } from "../controllers/farmerController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/products", protect, getFarmerProducts);
router.put("/:id", protect, updateProduct);

export default router;
