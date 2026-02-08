import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, deleteUser, updateUser, createUser, reset } from '../usersSlice';
import { Trash2, Edit2, Shield, User, Plus, Search, Filter } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import UserModal from '../components/UserModal';

const UsersPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { users, isLoading, isError, message } = useSelector((state) => state.users);
    const { user: currentUser } = useSelector((state) => state.auth);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        // Protect route
        if (currentUser && currentUser.role !== 'admin' && currentUser.role !== 'super-admin') {
            toast.error('Not authorized');
            navigate('/');
        } else {
            dispatch(getUsers());
        }

        return () => { dispatch(reset()); };
    }, [dispatch, isError, message, currentUser, navigate]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            dispatch(deleteUser(id));
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleSaveUser = (id, userData) => {
        if (id) {
            dispatch(updateUser({ id, userData }))
                .unwrap()
                .then(() => {
                    toast.success('User updated successfully');
                    setIsModalOpen(false);
                    setEditingUser(null);
                })
                .catch(toast.error);
        } else {
            dispatch(createUser(userData))
                .unwrap()
                .then(() => {
                    toast.success('User created successfully');
                    setIsModalOpen(false);
                })
                .catch(toast.error);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    if (isLoading) return <div className="p-8 text-center text-primary animate-pulse font-mono">LOADING USER DATABASE...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
                    <p className="text-text-muted">Manage system access and roles.</p>
                </div>

                <button
                    onClick={() => {
                        setEditingUser(null);
                        setIsModalOpen(true);
                    }}
                    className="btn btn-primary flex items-center shadow-lg shadow-primary/20"
                >
                    <Plus size={18} className="mr-2" />
                    Create User
                </button>
            </div>

            <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="input-field pl-10 bg-black/20 border-white/10 focus:bg-black/40 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center space-x-2 w-full md:w-auto">
                    <Filter size={18} className="text-text-muted" />
                    <select
                        className="input-field bg-black/20 border-white/10 focus:bg-black/40 text-sm py-2"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="all" className="bg-slate-900">All Roles</option>
                        <option value="user" className="bg-slate-900">Users</option>
                        <option value="agent" className="bg-slate-900">Agents</option>
                        <option value="manager" className="bg-slate-900">Managers</option>
                        <option value="admin" className="bg-slate-900">Admins</option>
                    </select>
                </div>

                <div className="text-sm font-mono text-text-muted">
                    Total: <span className="text-white font-bold">{filteredUsers.length}</span>
                </div>
            </div>

            <div className="glass-panel rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-black/20 text-text-muted uppercase text-xs font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Department</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary p-[1px]">
                                            <div className="w-full h-full rounded-full bg-surface flex items-center justify-center text-[10px] font-bold text-white">
                                                {user.name.charAt(0)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-sm">{user.name}</div>
                                            <div className="text-xs text-text-muted">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`badge ${user.role === 'admin' || user.role === 'super-admin' ? 'badge-primary' :
                                        user.role === 'manager' ? 'badge-info' :
                                            user.role === 'agent' ? 'badge-warning' :
                                                'badge-neutral'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-300">{user.department || '-'}</td>
                                <td className="px-6 py-4 text-sm text-text-muted font-mono">{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!(currentUser.role === 'admin' && (user.role === 'admin' || user.role === 'super-admin')) && (
                                            <>
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-2 rounded-lg hover:bg-white/10 text-text-muted hover:text-primary transition-colors"
                                                    title="Edit User"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="p-2 rounded-lg hover:bg-white/10 text-text-muted hover:text-danger transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-text-muted italic">
                                    No users found matching query.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={editingUser}
                currentUser={currentUser}
                onSave={handleSaveUser}
            />
        </div>
    );
};

export default UsersPage;
