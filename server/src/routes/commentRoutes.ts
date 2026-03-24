import { Router } from 'express';
import { createComment, getComments } from '../controllers/commentController';
import { commentLimiter } from '../middlewares/rateLimit';

const router = Router();

router.post('/', commentLimiter, createComment);
router.get('/:confessionId', getComments);

export default router;
