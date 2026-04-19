import Notification from './notification.model.js';

export const createNotification = async (recipientId, message, type = 'INFO', ticketId = null) => {
    try {
        return await Notification.create({
            recipient: recipientId,
            message,
            type,
            relatedTicket: ticketId
        });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

export const getUserNotifications = async (userId) => {
    return await Notification.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .limit(20); // Limit to last 20
};

export const markAsRead = async (notificationId, userId) => {
    return await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { isRead: true },
        { new: true }
    );
};
