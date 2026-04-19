import * as notificationService from './notification.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

// @desc    Get my notifications
// @route   GET /api/v1/notifications
// @access  Private
export const getMyNotifications = async (req, res, next) => {
    try {
        const notifications = await notificationService.getUserNotifications(req.user._id);
        res.status(200).json(new ApiResponse(200, notifications, 'Notifications retrieved'));
    } catch (error) {
        next(error);
    }
};

// @desc    Mark notification as read
// @route   PUT /api/v1/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
    try {
        await notificationService.markAsRead(req.params.id, req.user._id);
        res.status(200).json(new ApiResponse(200, null, 'Marked as read'));
    } catch (error) {
        next(error);
    }
};
