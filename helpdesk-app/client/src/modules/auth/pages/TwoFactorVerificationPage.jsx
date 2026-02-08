import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginVerify2FA, reset } from '../authSlice';

const TwoFactorVerificationPage = () => {
    const [otp, setOtp] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isError, isSuccess, message, isLoading, emailFor2FA } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess || user) {
            navigate('/');
        }
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onSubmit = (e) => {
        e.preventDefault();

        if (!emailFor2FA) {
            toast.error('Session expired, please login again');
            navigate('/login');
            return;
        }

        const userData = {
            email: emailFor2FA,
            otp,
        };

        dispatch(loginVerify2FA(userData));
    };

    if (!emailFor2FA) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p>No active 2FA session. Redirecting...</p>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-xl w-96">
                <h3 className="text-2xl font-bold text-center">2FA Verification</h3>
                <p className="text-center text-gray-500 mb-4">Enter the OTP sent to your email</p>
                <form onSubmit={onSubmit}>
                    <div className="mt-4">
                        <label className="block">OTP</label>
                        <input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-baseline justify-between">
                        <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900 w-full" disabled={isLoading}>
                            {isLoading ? 'Verifying...' : 'Verify'}
                        </button>
                    </div>
                    <div className="mt-4 text-center">
                        <button type="button" onClick={() => navigate('/login')} className="text-sm text-blue-600 hover:underline">
                            Back to Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TwoFactorVerificationPage;
