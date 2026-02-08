import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './auth.service';

// Get user from localStorage
const token = localStorage.getItem('token');

const initialState = {
    user: null,
    token: token ? token : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Register user
export const register = createAsyncThunk(
    'auth/register',
    async (user, thunkAPI) => {
        try {
            return await authService.register(user);
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

// Login user
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
    try {
        return await authService.login(user);
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Login Verify 2FA
export const loginVerify2FA = createAsyncThunk('auth/loginVerify2FA', async (data, thunkAPI) => {
    try {
        return await authService.loginVerify2FA(data);
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Verify Email
export const verifyEmail = createAsyncThunk('auth/verify-email', async (data, thunkAPI) => {
    try {
        return await authService.verifyEmail(data);
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const logout = createAsyncThunk('auth/logout', async () => {
    await authService.logout();
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
            state.twoFactorRequired = false;
            state.emailFor2FA = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message; // Just a success message
                state.user = null;
                state.token = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
                state.token = null;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;

                // Check if 2FA is required
                if (action.payload.data.twoFactorRequired) {
                    state.twoFactorRequired = true;
                    state.emailFor2FA = action.payload.data.email;
                    state.message = action.payload.message;
                } else {
                    state.isSuccess = true;
                    state.user = action.payload.data.user;
                    state.token = action.payload.data.token;
                    state.twoFactorRequired = false;
                    state.emailFor2FA = null;
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
                state.token = null;
            })
            .addCase(loginVerify2FA.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginVerify2FA.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.data.user;
                state.token = action.payload.data.token;
                state.twoFactorRequired = false;
                state.emailFor2FA = null;
            })
            .addCase(loginVerify2FA.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(verifyEmail.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyEmail.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.data.user;
                state.token = action.payload.data.token;
                state.message = action.payload.message;
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.twoFactorRequired = false;
                state.emailFor2FA = null;
            });
    },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
