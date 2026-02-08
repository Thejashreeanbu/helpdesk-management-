import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from './notification.service';

// Thunks
export const getNotifications = createAsyncThunk(
    'notifications/getAll',
    async (_, thunkAPI) => {
        try {
            return await notificationService.getNotifications();
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const markAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (id, thunkAPI) => {
        try {
            return await notificationService.markAsRead(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        isLoading: false,
        isError: false,
        message: ''
    },
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNotifications.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.notifications = action.payload;
            })
            .addCase(getNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const index = state.notifications.findIndex(n => n._id === action.payload);
                if (index !== -1) {
                    state.notifications[index].isRead = true;
                }
            });
    }
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
