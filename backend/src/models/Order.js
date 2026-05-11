import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		items: [
			{
				product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
				qty: Number,
				price: Number,
			},
		],
		total: { type: Number, default: 0 },
		status: { type: String, default: 'pending' },
		shippingAddress: { type: Object },
		tracking: { type: Object },
	},
	{ timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
