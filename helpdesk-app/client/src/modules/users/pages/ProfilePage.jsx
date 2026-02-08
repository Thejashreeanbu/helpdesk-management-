import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import authService from '../../auth/auth.service';
import { Shield, Lock, User, Key, Save } from 'lucide-react';

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const { currentPassword, newPassword, confirmPassword } = passwords;

    const onChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const onChangePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        setIsLoading(true);
        try {
            await authService.changePassword({ currentPassword, newPassword });
            toast.success('Password updated successfully');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">My Profile</h1>
                <p className="text-text-muted">Manage your profile and security settings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Info Card */}
                <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <User size={150} className="text-white" />
                    </div>

                    <div className="flex items-center space-x-6 mb-8 relative z-10">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary p-[2px] shadow-lg shadow-primary/20">
                            <div className="w-full h-full rounded-2xl bg-surface flex items-center justify-center text-white text-2xl font-bold">
                                {user?.name?.charAt(0)}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                            <p className="text-text-muted">{user?.email}</p>
                            <span className="badge badge-primary mt-2 inline-block">{user?.role}</span>
                        </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-1">Department</label>
                            <p className="text-white font-medium">{user?.department || 'Unassigned'}</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-1">Account Status</label>
                            <div className="flex items-center text-success font-bold text-sm">
                                <span className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></span>
                                Active
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Settings Card */}
                <div className="glass-panel p-8 rounded-2xl border-primary/20">
                    <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/5">
                        <Shield className="text-primary" size={24} />
                        <h2 className="text-xl font-bold text-white">Security</h2>
                    </div>

                    {/* Change Password Section */}
                    <div>
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center">
                            <Key size={16} className="mr-2 text-text-muted" /> Change Password
                        </h3>
                        <form onSubmit={onChangePasswordSubmit} className="space-y-4">
                            <div className="group">
                                <input
                                    type="password"
                                    name="currentPassword"
                                    placeholder="Current Password"
                                    value={currentPassword}
                                    onChange={onChange}
                                    className="input-field bg-black/20 border-white/10 focus:bg-black/40"
                                    required
                                />
                            </div>
                            <div className="group">
                                <input
                                    type="password"
                                    name="newPassword"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={onChange}
                                    className="input-field bg-black/20 border-white/10 focus:bg-black/40"
                                    required
                                />
                            </div>
                            <div className="group">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={onChange}
                                    className="input-field bg-black/20 border-white/10 focus:bg-black/40"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn btn-primary w-full py-3 text-sm font-bold uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center mt-6"
                            >
                                {isLoading ? (
                                    'Updating...'
                                ) : (
                                    <>
                                        <Save size={16} className="mr-2" /> Update Password
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
