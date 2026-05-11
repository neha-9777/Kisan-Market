import { v2 as cloudinary } from 'cloudinary';
import config from '../config/env.js';

if (config.CLOUDINARY_URL) {
  cloudinary.config({ secure: true });
}

export async function uploadImage(req, res) {
  try {
    if (!config.CLOUDINARY_URL) return res.status(500).json({ message: 'Cloudinary not configured' });
    const { image } = req.body; // expect base64 or data-url
    if (!image) return res.status(400).json({ message: 'No image provided' });

    const uploaded = await cloudinary.uploader.upload(image, { folder: 'kisan-market/products' });
    res.json({ url: uploaded.secure_url, id: uploaded.public_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
}
