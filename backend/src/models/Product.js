import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    images: [{ type: String }],
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    metadata: { type: Object },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
