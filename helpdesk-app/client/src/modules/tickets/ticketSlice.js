import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ticketService from './ticket.service';

const initialState = {
    tickets: [],
    ticket: {},
    history: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Create new ticket
export const createTicket = createAsyncThunk(
    'tickets/create',
    async (ticketData, thunkAPI) => {
        try {
            return await ticketService.createTicket(ticketData);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get user tickets
export const getTickets = createAsyncThunk(
    'tickets/getAll',
    async (_, thunkAPI) => {
        try {
            return await ticketService.getTickets();
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Close ticket
export const closeTicket = createAsyncThunk(
    'tickets/close',
    async (ticketId, thunkAPI) => {
        try {
            return await ticketService.closeTicket(ticketId);
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

// Update ticket
export const updateTicket = createAsyncThunk(
    'tickets/update',
    async ({ ticketId, ticketData }, thunkAPI) => {
        try {
            return await ticketService.updateTicket(ticketId, ticketData);
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

// Get ticket history
export const getTicketHistory = createAsyncThunk(
    'tickets/getHistory',
    async (ticketId, thunkAPI) => {
        try {
            return await ticketService.getTicketHistory(ticketId);
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

export const ticketSlice = createSlice({
    name: 'ticket',
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
            .addCase(createTicket.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createTicket.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(createTicket.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getTickets.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTickets.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tickets = action.payload;
            })
            .addCase(getTickets.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(closeTicket.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tickets.map((ticket) =>
                    ticket._id === action.payload._id ? (ticket.status = 'Resolved') : ticket
                );
                state.ticket = action.payload;
            })
            .addCase(updateTicket.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.ticket = action.payload;
            })
            .addCase(getTicketHistory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTicketHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.history = action.payload;
            })
            .addCase(getTicketHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.message = action.payload;
            });
    },
});

export const { reset } = ticketSlice.actions;
export default ticketSlice.reducer;
