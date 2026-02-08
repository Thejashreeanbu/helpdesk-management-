import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reportsService from './reports.service';

// Async Thunk to fetch stats
export const getReportStats = createAsyncThunk(
    'reports/getStats',
    async ({ startDate, endDate }, thunkAPI) => {
        try {
            return await reportsService.getReportStats({ startDate, endDate });
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    stats: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

const reportSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getReportStats.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getReportStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.stats = action.payload;
            })
            .addCase(getReportStats.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = reportSlice.actions;
export default reportSlice.reducer;
