import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Ticket, Users, BarChart3, LogOut, Search, Book, User as UserIcon, Bell, Menu, X } from 'lucide-react';
import { logout, reset } from '../../modules/auth/authSlice';
import NotificationBell from './NotificationBell';

const MainLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const NavItem = ({ to, icon: Icon, label }) => (
        <Link
            to={to}
            onClick={closeMobileMenu}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
            ${isActive(to)
                    ? 'bg-primary/20 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] border border-primary/30'
                    : 'text-text-muted hover:text-white hover:bg-white/5'}`
            }
        >
            {isActive(to) && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_#3b82f6]"></div>
            )}
            <Icon size={20} className={`transition-transform duration-300 group-hover:scale-110 ${isActive(to) ? 'text-primary drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]' : ''}`} />
            <span className="font-medium tracking-wide">{label}</span>
        </Link>
    );

    const SidebarContent = () => (
        <div className="glass-panel rounded-2xl h-full flex flex-col overflow-hidden relative">
            {/* Logo Area */}
            <div className="p-6 flex items-center space-x-4 border-b border-white/5 bg-white/5 relative">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                    <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        H
                    </div>
                </div>
                <div>
                    <span className="text-xl font-bold tracking-tight text-white block leading-none">HelpDesk</span>
                </div>

                {/* Decorative line */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                <div className="px-4 py-2">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">MENU</h3>
                </div>

                <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
                <NavItem to="/tickets" icon={Ticket} label="Tickets" />

                {(user?.role === 'admin' || user?.role === 'manager' || user?.role === 'super-admin') && (
                    <NavItem to="/reports" icon={BarChart3} label="Reports" />
                )}

                <NavItem to="/knowledge-base" icon={Book} label="Knowledge Base" />

                {(user?.role === 'admin' || user?.role === 'super-admin') && (
                    <>
                        <div className="px-4 py-2 mt-6">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Admin</h3>
                        </div>
                        <NavItem to="/users" icon={Users} label="User Management" />
                    </>
                )}
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-white/5 bg-black/20">
                {user ? (
                    <div className="glass-card p-3 rounded-xl border border-white/5 bg-white/5">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary p-[2px]">
                                <div className="w-full h-full rounded-full bg-surface flex items-center justify-center overflow-hidden">
                                    {user.profileImage ? (
                                        <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="font-bold text-white">{user.name.charAt(0)}</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                                <p className="text-xs text-text-muted truncate capitalize">{user.role}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <Link
                                to="/profile"
                                onClick={closeMobileMenu}
                                className="flex items-center justify-center py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-text-muted hover:text-white transition-colors border border-white/5"
                            >
                                <UserIcon size={14} className="mr-1.5" /> Profile
                            </Link>
                            <button
                                onClick={onLogout}
                                className="flex items-center justify-center py-2 px-3 rounded-lg bg-danger/10 hover:bg-danger/20 text-xs text-danger transition-colors border border-danger/20"
                            >
                                <LogOut size={14} className="mr-1.5" /> Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <Link to="/login" className="btn btn-primary w-full">Login</Link>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex h-screen overflow-hidden bg-background font-sans relative">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[100px] animate-[pulse-glow_4s_infinite]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[100px] animate-[pulse-glow_6s_infinite_reverse]"></div>
            </div>

            {/* Desktop Sidebar */}
            <aside className="w-72 hidden md:flex flex-col z-20 p-4">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden animate-in fade-in" onClick={closeMobileMenu}>
                    <div className="absolute left-0 top-0 bottom-0 w-80 p-4 animate-in slide-in-from-left duration-300" onClick={e => e.stopPropagation()}>
                        <SidebarContent />
                        <button
                            onClick={closeMobileMenu}
                            className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white hover:bg-white/20"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative z-10 transition-all duration-300">
                {/* Glass Header */}
                <header className="px-4 md:px-8 py-5 flex justify-between items-center sticky top-0 z-40">
                    <div className="flex items-center md:hidden mr-4">
                        <button onClick={toggleMobileMenu} className="p-2 text-white glass-panel rounded-lg active:scale-95 transition-transform">
                            <Menu size={24} />
                        </button>
                    </div>



                    <div className="flex items-center space-x-4 pl-4 ml-auto">
                        <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center border border-white/10 cursor-pointer hover:bg-white/10 transition-colors relative">
                            <NotificationBell />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-0 custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
