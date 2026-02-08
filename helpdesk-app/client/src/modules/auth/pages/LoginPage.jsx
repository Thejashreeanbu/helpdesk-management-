import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../authSlice';
import { toast } from 'react-toastify';
import { Lock, Mail, ArrowRight, Hexagon, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message, twoFactorRequired } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (twoFactorRequired) {
            navigate('/verify-2fa');
        } else if (isSuccess || user) {
            navigate('/');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, twoFactorRequired, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const userData = { email, password, portal: 'user' };
        dispatch(login(userData));
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[120px] animate-pulse delay-1000"></div>

            <div className="glass-panel w-full max-w-5xl flex overflow-hidden rounded-3xl relative z-10 shadow-2xl animate-in fade-in zoom-in duration-500">
                {/* Left Side - Form */}
                <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                    <div className="flex items-center space-x-3 mb-10">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
                            <Hexagon className="text-white" size={24} fill="currentColor" fillOpacity={0.2} />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-widest uppercase">Help<span className="text-primary">Desk</span></span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">Welcome Back</h2>
                        <p className="text-text-muted">Please enter your details to sign in.</p>
                    </div>

                    <form className="space-y-6" onSubmit={onSubmit}>
                        <div className="group">
                            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 group-focus-within:text-white transition-colors">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    className="input-field pl-12 py-3 bg-black/20 border-white/10 focus:bg-black/40 text-lg"
                                    placeholder="user@helpdesk.com"
                                />
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 group-focus-within:text-white transition-colors">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
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

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center space-x-2 cursor-pointer group">
                                <input type="checkbox" className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary/50 transition-all cursor-pointer" />
                                <span className="text-text-muted group-hover:text-white transition-colors">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="font-bold text-primary hover:text-white transition-colors tracking-wide">Forgot Password?</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full py-4 text-sm font-bold tracking-widest uppercase shadow-lg shadow-primary/25 hover:shadow-primary/50"
                        >
                            <span className="flex items-center justify-center space-x-2">
                                <span>{isLoading ? 'Signing In...' : ' Sign In'}</span>
                                {!isLoading && <ArrowRight size={18} />}
                            </span>
                        </button>
                    </form>

                    <div className="mt-10 pt-6 border-t border-white/5 text-center">
                        <p className="text-sm text-text-muted mb-4">
                            Don't have an account? <Link to="/register" className="font-bold text-white hover:text-primary transition-colors ml-1">Create account</Link>
                        </p>
                        <Link to="/staff/login" className="inline-flex items-center text-xs font-mono text-text-muted hover:text-warning transition-colors border border-white/5 hover:border-warning/30 rounded px-3 py-1 bg-white/5">
                            <ShieldCheck size={12} className="mr-2" />
                            STAFF/ADMIN PORTAL
                        </Link>
                    </div>
                </div>

                {/* Right Side - Visual */}
                <div className="hidden md:flex w-1/2 bg-black/40 relative items-center justify-center p-12 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 z-0"></div>

                    {/* Decorative Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

                    <div className="relative z-10 text-center space-y-6 max-w-md">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-primary blur-[40px] opacity-30 animate-pulse"></div>
                            <Hexagon size={120} className="text-white relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" strokeWidth={0.5} />
                        </div>

                        <div>
                            <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">Streamline Your Support</h3>
                            <p className="text-white/60 font-medium">Manage tickets, track performance, and delight your customers with our modern helpdesk solution.</p>
                        </div>

                        <div className="flex justify-center space-x-2 mt-8">
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce delay-100"></div>
                            <div className="w-2 h-2 rounded-full bg-secondary animate-bounce delay-200"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
