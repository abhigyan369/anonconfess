import { Request, Response, NextFunction } from 'express';
import Comment from '../models/Comment';
import Confession from '../models/Confession';
import { createError } from '../middlewares/errorHandler';
import { containsProfanity } from '../services/profanityService';
import { getIO } from '../config/socket';

// POST /api/comments
export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { confessionId, content, anonymousId, parentId } = req.body;

    if (!confessionId || !content || !anonymousId) {
      return next(createError('confessionId, content, and anonymousId are required', 400));
    }

    if (containsProfanity(content)) {
      return next(createError('Comment contains inappropriate language', 400));
    }

    const confession = await Confession.findById(confessionId);
    if (!confession) return next(createError('Confession not found', 404));

    const comment = await Comment.create({ confessionId, content, anonymousId, parentId });

    // Increment comment count
    await Confession.findByIdAndUpdate(confessionId, { $inc: { commentCount: 1 } });

    // Emit real-time event to the confession room
    getIO().to(confessionId).emit('new-comment', comment);

    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

// GET /api/comments/:confessionId
export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { confessionId } = req.params;
    const comments = await Comment.find({ confessionId })
      .sort({ createdAt: 1 })
      .lean();
    res.json({ success: true, data: comments });
  } catch (err) {
    next(err);
  }
};
