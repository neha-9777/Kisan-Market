import mongoose from 'mongoose';
import config from './env.js';

export async function connectDB() {
  const uri = config.MONGO_URI;
  if (!uri) {
    console.warn('MONGO_URI not set in environment; skipping DB connection');
    return;
  }

  try {
    await mongoose.connect(uri, {
      // useNewUrlParser and useUnifiedTopology are defaults in mongoose v6+
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}
