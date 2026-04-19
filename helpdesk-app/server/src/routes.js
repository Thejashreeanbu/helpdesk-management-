import { Router } from 'express';

import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/user.routes.js';
import ticketRoutes from './modules/tickets/ticket.routes.js';
import notificationRoutes from './modules/notifications/notification.routes.js';
import knowledgeBaseRoutes from './modules/knowledgeBase/knowledgeBase.routes.js';
import reportRoutes from './modules/reports/report.routes.js';

const router = Router();

// Use Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tickets', ticketRoutes);
router.use('/notifications', notificationRoutes);
router.use('/knowledge-base', knowledgeBaseRoutes);
router.use('/reports', reportRoutes);

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

export default router;
