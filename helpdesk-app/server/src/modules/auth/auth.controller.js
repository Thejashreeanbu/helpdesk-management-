import * as authService from './auth.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json(new ApiResponse(201, result, 'User registered. Please check email for verification code.'));
    } catch (error) {
        next(error);
    }
};

// @desc    Verify Email
// @route   POST /api/v1/auth/verify-email
// @access  Public
export const verifyEmail = async (req, res, next) => {
    try {
        const { email, token } = req.body;
        const user = await authService.verifyEmail(email, token);

        // Optionally log them in directly or ask to login
        // Let's return the token so they are logged in immediately after verification
        const authToken = user.getSignedJwtToken();

        res.status(200).json(new ApiResponse(200, { token: authToken, user }, 'Email verified successfully'));
    } catch (error) {
        next(error);
    }
}

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const { email, password, portal } = req.body;
        const result = await authService.login(email, password, portal);

        // Check if 2FA is required
        if (result.twoFactorRequired) {
            return res.status(200).json(new ApiResponse(200, result, '2FA OTP sent to email'));
        }

        const user = result;
        const token = user.getSignedJwtToken();

        const options = {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            httpOnly: true,
        };

        res
            .status(200)
            .cookie('token', token, options)
            .json(new ApiResponse(200, { token, user }, 'User logged in successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Verify 2FA OTP during login
// @route   POST /api/v1/auth/login-verify-2fa
// @access  Public
export const loginVerify2FA = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const user = await authService.loginVerify2FA(email, otp);
        const token = user.getSignedJwtToken();

        const options = {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            httpOnly: true,
        };

        res
            .status(200)
            .cookie('token', token, options)
            .json(new ApiResponse(200, { token, user }, 'User logged in successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json(new ApiResponse(200, user, 'User data retrieved'));
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
    try {
        const result = await authService.forgotPassword(req.body.email);
        res.status(200).json(new ApiResponse(200, result, 'Email sent'));
    } catch (error) {
        next(error);
    }
};

// @desc    Reset Password
// @route   PUT /api/v1/auth/reset-password/:resetToken
// @access  Public
export const resetPassword = async (req, res, next) => {
    try {
        console.log('Reset Password Request Body:', req.body);
        const { email, otp, password } = req.body;
        const user = await authService.resetPassword(email, otp, password);
        const token = user.getSignedJwtToken();

        res.status(200).json(new ApiResponse(200, { token, user }, 'Password updated successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Change Password
// @route   PUT /api/v1/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await authService.changePassword(req.user.id, currentPassword, newPassword);
        const token = user.getSignedJwtToken();

        res.status(200).json(new ApiResponse(200, { token, user }, 'Password updated successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Enable 2FA
// @route   POST /api/v1/auth/enable-2fa
// @access  Private
export const enable2FA = async (req, res, next) => {
    try {
        const result = await authService.enable2FA(req.user.id);
        res.status(200).json(new ApiResponse(200, result, 'OTP sent to email'));
    } catch (error) {
        next(error);
    }
};

// @desc    Verify 2FA OTP to enable
// @route   POST /api/v1/auth/verify-2fa
// @access  Private
export const verify2FA = async (req, res, next) => {
    try {
        const { otp } = req.body;
        const result = await authService.verify2FA(req.user.id, otp);
        res.status(200).json(new ApiResponse(200, result, '2FA enabled successfully'));
    } catch (error) {
        next(error);
    }
};
