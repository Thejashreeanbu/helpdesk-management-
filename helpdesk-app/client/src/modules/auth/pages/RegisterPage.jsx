import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register, reset } from '../authSlice';
import { toast } from 'react-toastify';
import { User, Mail, Lock, ArrowRight, Hexagon, Shield } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const { name, email, password } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isSuccess) {
            navigate('/verify-email', { state: { email } });
        } else if (isError) {
            toast.error(message);
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch, email]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const userData = {
            name,
            email,
            password,
        };

        dispatch(register(userData));
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[120px] animate-pulse delay-1000"></div>

            <div className="glass-panel w-full max-w-md p-10 rounded-3xl relative z-10 shadow-2xl animate-in fade-in zoom-in duration-500 border-t border-white/10">
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 rotate-3 transition-transform hover:rotate-6">
                        <Hexagon className="text-white" size={32} />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Registration</h2>
                    <p className="text-text-muted">Create a new account</p>
                </div>

                <form className="space-y-5" onSubmit={onSubmit}>
                    <div className="group">
                        <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 group-focus-within:text-white transition-colors">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={onChange}
                                className="input-field pl-12 py-3 bg-black/20 border-white/10 focus:bg-black/40"
                                placeholder="Agent X"
                            />
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 group-focus-within:text-white transition-colors">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                className="input-field pl-12 py-3 bg-black/20 border-white/10 focus:bg-black/40"
                                placeholder="agent@nexus.com"
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
                                className="input-field pl-12 py-3 bg-black/20 border-white/10 focus:bg-black/40"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary w-full py-4 text-sm font-bold tracking-widest uppercase shadow-lg shadow-primary/25 hover:shadow-primary/50 mt-6"
                    >
                        <span className="flex items-center justify-center space-x-2">
                            <span>{isLoading ? 'Processing...' : 'Register'}</span>
                            {!isLoading && <ArrowRight size={18} />}
                        </span>
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-sm text-text-muted">
                        Already have an account? <Link to="/login" className="font-bold text-white hover:text-primary transition-colors ml-1">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
