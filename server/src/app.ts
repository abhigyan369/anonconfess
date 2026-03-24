import express from 'express';
import cors from 'cors';
import { globalLimiter } from './middlewares/rateLimit';
import errorHandler from './middlewares/errorHandler';
import confessionRoutes from './routes/confessionRoutes';
import commentRoutes from './routes/commentRoutes';
import reactionRoutes from './routes/reactionRoutes';
import reportRoutes from './routes/reportRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

// CORS middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Rate limiter
app.use(globalLimiter);

// ✅ Body parser
app.use(express.json({ limit: '10kb' }));

// --- Routes ---
app.use('/api/confessions', confessionRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/reactions', reactionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// --- 404 ---
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// --- Error handler ---
app.use(errorHandler);

export default app;