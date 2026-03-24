import { Request, Response, NextFunction } from 'express';
import Report from '../models/Report';
import Confession from '../models/Confession';
import { createError } from '../middlewares/errorHandler';

// GET /api/admin/reports
export const getReports = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resolved = req.query.resolved === 'true';
    const reports = await Report.find({ resolved })
      .populate('confessionId', 'content anonymousId createdAt')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: reports });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/reports/:id
export const resolveReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { resolved: true },
      { new: true }
    );
    if (!report) return next(createError('Report not found', 404));
    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/confessions/:id
export const deleteConfession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const confession = await Confession.findByIdAndDelete(req.params.id);
    if (!confession) return next(createError('Confession not found', 404));
    res.json({ success: true, message: 'Confession deleted' });
  } catch (err) {
    next(err);
  }
};
