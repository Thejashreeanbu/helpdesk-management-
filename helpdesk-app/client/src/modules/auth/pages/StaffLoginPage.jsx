import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../authSlice';
import { toast } from 'react-toastify';
import { Lock, Mail, ArrowRight, ShieldCheck, Hexagon } from 'lucide-react';

const StaffLoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess || user) {
            navigate('/');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const userData = { email, password, portal: 'staff' };
        dispatch(login(userData));
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse delay-1000"></div>

            <div className="glass-panel w-full max-w-md p-8 rounded-3xl relative z-10 shadow-2xl animate-in fade-in zoom-in duration-500 border-t-4 border-t-secondary">

                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/30 rotate-3 transform hover:rotate-6 transition-transform">
                            <ShieldCheck size={32} className="text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Staff Portal</h2>
                    <p className="text-text-muted mt-2 text-sm font-medium uppercase tracking-widest">Authorized Personnel Only</p>
                </div>

                <form className="space-y-6" onSubmit={onSubmit}>
                    <div className="group">
                        <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2 group-focus-within:text-white transition-colors">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-secondary transition-colors" size={20} />
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                className="input-field pl-12 py-3 bg-black/20 border-white/10 focus:bg-black/40 text-lg"
                                placeholder="admin@helpdesk.com"
                            />
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2 group-focus-within:text-white transition-colors">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-secondary transition-colors" size={20} />
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                className="input-field pl-12 py-3 bg-black/20 border-white/10 focus:bg-black/40 text-lg"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn w-full py-4 text-sm font-bold tracking-widest uppercase shadow-lg shadow-secondary/25 hover:shadow-secondary/50 bg-secondary text-white border border-white/10 hover:bg-purple-500"
                    >
                        <span className="flex items-center justify-center space-x-2">
                            <span>{isLoading ? 'Verifying...' : 'Access Portal'}</span>
                            {!isLoading && <ArrowRight size={18} />}
                        </span>
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-white/5">
                    <Link to="/login" className="text-xs font-mono text-text-muted hover:text-white transition-colors flex items-center justify-center">
                        <ArrowRight className="mr-2 rotate-180" size={14} />
                        Back to User Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StaffLoginPage;
