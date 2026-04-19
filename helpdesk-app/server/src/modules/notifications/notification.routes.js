import express from 'express';
import * as notificationController from './notification.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect); // All routes private

router.get('/', notificationController.getMyNotifications);
router.put('/:id/read', notificationController.markAsRead);

export default router;
