import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const CLOUDINARY_URL = process.env.CLOUDINARY_URL || '';

export default {
  NODE_ENV,
  PORT,
  MONGO_URI,
  JWT_SECRET,
  GEMINI_API_KEY,
  CLOUDINARY_URL,
};
