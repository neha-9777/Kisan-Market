import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import errorMiddleware from './middlewares/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { apiLimiter } from './middlewares/rateLimiter.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiLimiter);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);

// Error handler (should be last)
app.use(errorMiddleware);

export default app;
