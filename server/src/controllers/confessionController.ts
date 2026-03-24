import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import Confession from '../models/Confession';
import { createError } from '../middlewares/errorHandler';
import { containsProfanity } from '../services/profanityService';
import { getTrendingScore } from '../services/trendingService';

// Proper type for lean() results
interface ConfessionType {
  _id: Types.ObjectId;
  content: string;
  tags: string[];
  anonymousId: string;
  reactions: {
    support: string[];
    relate: string[];
    shock: string[];
  };
  commentCount: number;
  createdAt: Date;
}

// POST /api/confessions
export const createConfession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { content, tags = [], anonymousId } = req.body;

    if (!content || !anonymousId) {
      return next(createError('Content and anonymousId are required', 400));
    }

    if (containsProfanity(content)) {
      return next(createError('Confession contains inappropriate language', 400));
    }

    const confession = await Confession.create({ content, tags, anonymousId });

    res.status(201).json({
      success: true,
      data: confession,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/confessions
export const getConfessions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
    const tag = req.query.tag as string;
    const sort = req.query.sort as string;

    const filter: Record<string, unknown> = {};
    if (tag) filter.tags = tag;

    const skip = (page - 1) * limit;

    // ✅ SAFE CAST FIX
    const confessions = (await Confession.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit + 1)
      .lean()) as unknown as ConfessionType[];

    let results: ConfessionType[] = confessions.slice(0, limit);

    if (sort === 'trending') {
      results.sort((a, b) => {
        const ta =
          a.reactions.support.length +
          a.reactions.relate.length +
          a.reactions.shock.length;

        const tb =
          b.reactions.support.length +
          b.reactions.relate.length +
          b.reactions.shock.length;

        return (
          getTrendingScore(tb, b.commentCount, b.createdAt) -
          getTrendingScore(ta, a.commentCount, a.createdAt)
        );
      });
    }

    const hasMore = confessions.length > limit;
    const total = await Confession.countDocuments(filter);

    res.json({
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        hasMore,
        total,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/confessions/:id
export const getConfessionById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const confession = await Confession.findById(req.params.id).lean();

    if (!confession) {
      return next(createError('Confession not found', 404));
    }

    res.json({
      success: true,
      data: confession,
    });
  } catch (err) {
    next(err);
  }
};