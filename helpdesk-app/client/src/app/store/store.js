import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../modules/auth/authSlice';
import ticketReducer from '../../modules/tickets/ticketSlice';
import usersReducer from '../../modules/users/usersSlice';
import noteReducer from '../../modules/tickets/noteSlice';
import notificationReducer from '../../modules/notifications/notificationSlice';
import knowledgeBaseReducer from '../../modules/knowledgeBase/knowledgeBaseSlice';
import reportsReducer from '../../modules/reports/reportsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tickets: ticketReducer,
        users: usersReducer,
        notes: noteReducer,
        notifications: notificationReducer,
        knowledgeBase: knowledgeBaseReducer,
        reports: reportsReducer,
    },
});
