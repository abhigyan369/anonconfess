import { Request, Response, NextFunction } from 'express';
import Report from '../models/Report';
import Confession from '../models/Confession';
import { createError } from '../middlewares/errorHandler';

// POST /api/reports
export const createReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { confessionId, reason, anonymousId } = req.body;

    if (!confessionId || !reason || !anonymousId) {
      return next(createError('confessionId, reason, and anonymousId are required', 400));
    }

    const confession = await Confession.findById(confessionId);
    if (!confession) return next(createError('Confession not found', 404));

    // Prevent duplicate reports from same user
    const existing = await Report.findOne({ confessionId, anonymousId });
    if (existing) {
      return next(createError('You have already reported this confession', 409));
    }

    const report = await Report.create({ confessionId, reason, anonymousId });
    await Confession.findByIdAndUpdate(confessionId, { $inc: { reportCount: 1 } });

    res.status(201).json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};
