import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    image: String,
    description: String,
    category: String,
    quantity: Number,
    unit: String,
    available: {
      type: Boolean,
      default: true,
    },
    farmerName: String,
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
