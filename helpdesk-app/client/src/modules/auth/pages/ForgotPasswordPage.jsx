import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../auth.service';

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onSendOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await authService.forgotPassword(email);
            toast.success('OTP sent to your email');
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const onResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await authService.resetPassword({ email, otp, password: newPassword });
            toast.success('Password reset successfully! Logging you in...');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-xl w-96">
                <h3 className="text-2xl font-bold text-center">
                    {step === 1 ? 'Forgot Password' : 'Reset Password'}
                </h3>

                {step === 1 ? (
                    <form onSubmit={onSendOtp}>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mt-6">
                            <button
                                className="w-full px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={onResetPassword}>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">OTP</label>
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    maxLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <button
                                className="w-full px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-200"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>
                        <div className="mt-2 text-center">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Resend OTP / Change Email
                            </button>
                        </div>
                    </form>
                )}

                <div className="mt-4 text-center border-t pt-4">
                    <button type="button" onClick={() => navigate('/login')} className="text-sm text-gray-500 hover:text-gray-700">
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
