import crypto from 'crypto';
import User from '../users/user.model.js';
import { ApiError } from '../../utils/apiResponse.js';
import { sendEmail } from '../../utils/emailService.js';

export const register = async (userData) => {
    const { name, email, password, role, department } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, 'User already exists');
    }

    // Generate Verification OTP
    const verificationToken = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 chars
    const verificationTokenExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role: role || 'user',
        department,
        isVerified: false,
        verificationToken,
        verificationTokenExpire,
    });

    // Send Verification Email
    const message = `Your verification code is: ${verificationToken}`;
    try {
        await sendEmail({
            to: user.email,
            subject: 'Account Verification Token',
            html: `<p>Your verification code is: <b>${verificationToken}</b></p>`,
        });
    } catch (err) {
        console.error(err);
    }

    return { message: 'Verification email sent' };
};

export const verifyEmail = async (email, token) => {
    const user = await User.findOne({
        email,
        verificationToken: token,
        verificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
        throw new ApiError(400, 'Invalid or expired verification token');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;

    await user.save();

    return user;
};

export const login = async (email, password, portal) => {
    // Validate email & password
    if (!email || !password) {
        throw new ApiError(400, 'Please provide an email and password');
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password +twoFactorEnabled +twoFactorSecret +twoFactorExpires');
    if (!user) {
        throw new ApiError(401, 'Invalid credentials');
    }

    // Portal Access Control
    if (portal === 'staff') {
        if (user.role === 'user') {
            throw new ApiError(403, 'Access denied. Staff only.');
        }
    } else if (portal === 'user') {
        if (user.role !== 'user') {
            throw new ApiError(403, 'Access denied. Users only. Please use Staff Login.');
        }
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new ApiError(401, 'Invalid credentials');
    }

    // Check if verified (only for regular users)
    if (user.role === 'user' && !user.isVerified) {
        throw new ApiError(401, 'Please verify your email first');
    }

    // Mandatory 2FA removed as per request.
    // All roles login directly (Password only)
    return user;
};

export const loginVerify2FA = async (email, otp) => {
    if (!email || !otp) {
        throw new ApiError(400, 'Please provide email and OTP');
    }

    const user = await User.findOne({ email }).select('+twoFactorSecret +twoFactorExpires');

    if (!user) {
        throw new ApiError(401, 'Invalid credentials');
    }

    if (!user.twoFactorSecret || !user.twoFactorExpires) {
        throw new ApiError(400, 'No OTP requested');
    }

    // Hash provided OTP to compare
    const hashedOtp = crypto
        .createHash('sha256')
        .update(otp)
        .digest('hex');

    if (hashedOtp !== user.twoFactorSecret) {
        throw new ApiError(401, 'Invalid OTP');
    }

    if (user.twoFactorExpires < Date.now()) {
        throw new ApiError(401, 'OTP expired');
    }

    // Clear 2FA fields
    user.twoFactorSecret = undefined;
    user.twoFactorExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return user;
};

// Forgot Password (OTP)
export const forgotPassword = async (email) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Generate 6-digit OTP
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    const message = `You requested a password reset. Your OTP is: ${resetToken}`;

    try {
        await sendEmail({
            to: user.email,
            subject: 'Password Reset OTP',
            html: `
                <h1>Password Reset Request</h1>
                <p>Your OTP to reset your password is: <b>${resetToken}</b></p>
                <p>It expires in 10 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
            `,
        });

        return { data: 'OTP sent to email' };
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        throw new ApiError(500, 'Email could not be sent');
    }
};

// Reset Password (Verify OTP)
export const resetPassword = async (email, otp, password) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(otp)
        .digest('hex');

    console.log(`Verifying Reset for Email: ${email}`);
    console.log(`Hashed OTP: ${resetPasswordToken}`);

    const user = await User.findOne({
        email,
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        console.log('User not found or token invalid/expired');
        // Let's debug what we found if we just search by email
        const debugUser = await User.findOne({ email });
        if (debugUser) {
            console.log('User found by email:', debugUser.email);
            console.log('Stored Reset Token:', debugUser.resetPasswordToken);
            console.log('Token Expire:', debugUser.resetPasswordExpire);
            console.log('Now:', new Date());
        }
        throw new ApiError(400, 'Invalid OTP or Email');
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return user;
};

export const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
        throw new ApiError(401, 'Incorrect current password');
    }

    user.password = newPassword;
    await user.save();

    return user;
};

export const enable2FA = async (userId) => {
    const user = await User.findById(userId);

    if (user.twoFactorEnabled) {
        throw new ApiError(400, '2FA already enabled');
    }

    // Send OTP to confirm email
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP and save (store temporarily to verify enablement)
    user.twoFactorSecret = crypto
        .createHash('sha256')
        .update(otp)
        .digest('hex');

    user.twoFactorExpires = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    await sendEmail({
        to: user.email,
        subject: 'Enable 2FA OTP',
        html: `<p>Your OTP to enable 2FA is: <b>${otp}</b></p>`,
    });

    return { message: 'OTP sent to email to confirm 2FA enablement' };
};

export const verify2FA = async (userId, otp) => {
    const user = await User.findById(userId).select('+twoFactorSecret +twoFactorExpires');

    const hashedOtp = crypto
        .createHash('sha256')
        .update(otp)
        .digest('hex');

    if (hashedOtp !== user.twoFactorSecret) {
        throw new ApiError(401, 'Invalid OTP');
    }

    if (user.twoFactorExpires < Date.now()) {
        throw new ApiError(401, 'OTP expired');
    }

    user.twoFactorEnabled = true;
    user.twoFactorSecret = undefined;
    user.twoFactorExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return { message: '2FA Enabled Successfully' };
};
