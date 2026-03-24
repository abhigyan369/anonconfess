import { Router } from 'express';
import { reactToConfession } from '../controllers/reactionController';

const router = Router();

router.post('/', reactToConfession);

export default router;
