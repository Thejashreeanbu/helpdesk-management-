import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail, reset } from '../authSlice';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const EmailVerificationPage = () => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    // Get email from router state or auth state
    const email = location.state?.email;

    const { isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (!email) {
            toast.error('No email provided for verification');
            navigate('/register');
        }

        if (isError) {
            toast.error(message);
        }

        if (isSuccess) {
            navigate('/access-granted');
        }

        return () => {
            dispatch(reset());
        }
    }, [email, isError, isSuccess, message, navigate, dispatch]);

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(verifyEmail({ email, token: otp }));
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Cyberpunk Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Glass Card */}
                <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.3)] overflow-hidden relative">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 font-mono tracking-tighter">
                            SYSTEM VERIFICATION
                        </h2>
                        <p className="text-slate-400 text-sm font-mono">
                            Enter the secure token sent to <span className="text-blue-400 font-bold">{email}</span>
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="ENTER CODE"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-4 text-center text-2xl font-mono tracking-[0.5em] text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 group-hover:border-slate-600"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                required
                            />
                            {/* Scanning effect on input */}
                            <div className="absolute bottom-0 left-0 h-[2px] bg-blue-500 w-0 group-focus-within:w-full transition-all duration-500"></div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 uppercase tracking-widest text-sm relative overflow-hidden group"
                        >
                            <span className="relative z-10">{isLoading ? 'PROCESSING...' : 'INITIALIZE LINK'}</span>
                            {/* Button Shine Effect */}
                            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-30deg] group-hover:animate-[shine_1.5s_infinite]"></div>
                        </motion.button>
                    </form>

                    {/* Decorative Elements */}
                    <div className="mt-8 flex justify-between items-center text-[10px] text-slate-600 font-mono uppercase">
                        <span>Status: <span className="text-emerald-500 animate-pulse">Active</span></span>
                        <span>Secured by: <span className="text-blue-500">Quantum Enc</span></span>
                    </div>
                </div>
            </motion.div>

            <style>{`
                @keyframes shine {
                    0% { left: -100%; }
                    100% { left: 200%; }
                }
            `}</style>
        </div>
    );
};

export default EmailVerificationPage;
