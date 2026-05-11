import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.post('/image', protect, uploadImage);
export default router;
