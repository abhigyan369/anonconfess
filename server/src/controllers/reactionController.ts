import { Request, Response, NextFunction } from 'express';
import Confession from '../models/Confession';
import { createError } from '../middlewares/errorHandler';

type ReactionType = 'support' | 'relate' | 'shock';
const VALID_REACTIONS: ReactionType[] = ['support', 'relate', 'shock'];

// POST /api/reactions
export const reactToConfession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { confessionId, type, anonymousId } = req.body;

    if (!confessionId || !type || !anonymousId) {
      return next(createError('confessionId, type, and anonymousId are required', 400));
    }

    if (!VALID_REACTIONS.includes(type)) {
      return next(createError('Invalid reaction type. Must be: support, relate, or shock', 400));
    }

    const confession = await Confession.findById(confessionId);
    if (!confession) return next(createError('Confession not found', 404));

    const reactionKey = type as ReactionType;
    const allReactionKeys = VALID_REACTIONS.filter((r) => r !== reactionKey);

    // Remove from all other reaction arrays (switch reaction)
    for (const key of allReactionKeys) {
      confession.reactions[key] = confession.reactions[key].filter(
        (id) => id !== anonymousId
      );
    }

    // Toggle current reaction
    const alreadyReacted = confession.reactions[reactionKey].includes(anonymousId);
    if (alreadyReacted) {
      confession.reactions[reactionKey] = confession.reactions[reactionKey].filter(
        (id) => id !== anonymousId
      );
    } else {
      confession.reactions[reactionKey].push(anonymousId);
    }

    await confession.save();

    const reactionCounts = {
      support: confession.reactions.support.length,
      relate: confession.reactions.relate.length,
      shock: confession.reactions.shock.length,
    };

    res.json({ success: true, data: { reactions: reactionCounts, toggled: !alreadyReacted } });
  } catch (err) {
    next(err);
  }
};
