import { Router } from 'express';
import { getReports, resolveReport, deleteConfession } from '../controllers/adminController';

const router = Router();

// Basic API key guard for admin routes
router.use((req, res, next) => {
  const secret = req.headers['x-admin-secret'];
  if (secret !== process.env.ADMIN_SECRET) {
    res.status(403).json({ success: false, message: 'Forbidden' });
    return;
  }
  next();
});

router.get('/reports', getReports);
router.patch('/reports/:id', resolveReport);
router.delete('/confessions/:id', deleteConfession);

export default router;
