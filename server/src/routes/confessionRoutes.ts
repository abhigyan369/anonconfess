import express from 'express';
import {
  createConfession,
  getConfessions,
  getConfessionById,
} from '../controllers/confessionController';

const router = express.Router();

// ✅ GET routes
router.get('/', getConfessions);
router.get('/:id', getConfessionById);

// ✅ POST route
router.post('/', createConfession);

export default router;