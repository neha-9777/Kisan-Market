import express from 'express';
import { getProducts, addProduct, deleteProduct } from '../controllers/productController.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', upload.array('images', 10), addProduct);
router.delete('/:id', deleteProduct);

export default router;
