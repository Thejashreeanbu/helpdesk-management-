import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Shield, Briefcase } from 'lucide-react';

const UserModal = ({ isOpen, onClose, onSave, user, currentUser }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'user',
        department: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                role: user.role || 'user',
                department: user.department || '',
            });
        } else {
            // Reset for create mode
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'user',
                department: '',
            });
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(user ? user._id : null, formData);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-white/10 relative animate-in zoom-in-95 duration-200">
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none"></div>

                <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-white/5 relative z-10">
                    <h3 className="font-bold text-white text-lg tracking-tight flex items-center">
                        <User size={20} className="mr-2 text-primary" />
                        {user ? 'Edit User Profile' : 'Initialize New User'}
                    </h3>
                    <button onClick={onClose} className="text-text-muted hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5 relative z-10">
                    <div>
                        <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Name</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={16} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input-field pl-10 bg-black/40"
                                placeholder="Full Name"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={16} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field pl-10 bg-black/40"
                                placeholder="email@example.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Password field only for new users */}
                    {!user && (
                        <div>
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={16} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password || ''}
                                    onChange={handleChange}
                                    className="input-field pl-10 bg-black/40"
                                    required
                                    minLength={6}
                                    placeholder="Min. 6 characters"
                                />
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Role</label>
                            <div className="relative group">
                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={16} />
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="input-field pl-10 bg-black/40 appearance-none"
                                >
                                    <option value="user" className="bg-slate-900">User</option>
                                    <option value="agent" className="bg-slate-900">Agent</option>
                                    <option value="manager" className="bg-slate-900">Manager</option>
                                    {/* RBAC: Admin cannot promote to Admin/Super Admin */}
                                    {currentUser?.role !== 'admin' && (
                                        <>
                                            <option value="admin" className="bg-slate-900">Admin</option>
                                            <option value="super-admin" className="bg-slate-900">Super Admin</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Dept</label>
                            <div className="relative group">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={16} />
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="input-field pl-10 bg-black/40 appearance-none"
                                >
                                    <option value="" className="bg-slate-900">None</option>
                                    <option value="IT" className="bg-slate-900">IT</option>
                                    <option value="HR" className="bg-slate-900">HR</option>
                                    <option value="Sales" className="bg-slate-900">Sales</option>
                                    <option value="Finance" className="bg-slate-900">Finance</option>
                                    <option value="Support" className="bg-slate-900">Support</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end space-x-3 border-t border-white/5 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors font-bold text-sm uppercase tracking-wider"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            {user ? 'Save Changes' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
