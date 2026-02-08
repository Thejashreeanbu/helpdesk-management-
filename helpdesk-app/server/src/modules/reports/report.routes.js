import express from 'express';
import { getStats } from './report.controller.js';
import { protect, authorize } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Only Admins and Managers for now
router.get('/stats', protect, authorize('admin', 'manager', 'super-admin'), getStats);

export default router;
