import rateLimit from 'express-rate-limit';
import { Request } from 'express';

// 🔥 Global limiter (loose for dev)
// IMPORTANT: skip OPTIONS to not block CORS preflight
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // increased
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => req.method === 'OPTIONS',
});

// 🔥 Confession limiter (loose for dev)
export const createConfessionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1000, // increased from 10 → 1000
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => req.method === 'OPTIONS',
});

// 🔥 Comment limiter
export const commentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => req.method === 'OPTIONS',
});