import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getNotifications, markAsRead } from '../../modules/notifications/notificationSlice';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Clock, AlertCircle, CheckCircle, Info } from 'lucide-react';

const NotificationBell = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { notifications, isLoading } = useSelector((state) => state.notifications);
    const { user } = useSelector((state) => state.auth);

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Filter unread
    const unreadCount = (notifications || []).filter(n => !n.isRead).length;

    useEffect(() => {
        if (user) {
            dispatch(getNotifications());
            // Optional: Poll every 30s
            const interval = setInterval(() => dispatch(getNotifications()), 30000);
            return () => clearInterval(interval);
        }
    }, [dispatch, user]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            dispatch(markAsRead(notification._id));
        }
        if (notification.relatedTicket) {
            navigate(`/ticket/${notification.relatedTicket}`);
            setIsOpen(false);
        }
    };

    const toggleDropdown = () => setIsOpen(!isOpen);

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="relative p-2 text-text-muted hover:text-white transition-all focus:outline-none group"
            >
                {/* Bell Icon */}
                <div className={`relative ${unreadCount > 0 ? 'animate-pulse-glow' : ''}`}>
                    <Bell size={24} className="group-hover:rotate-12 transition-transform" />
                </div>

                {/* Badge */}
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-danger rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)] border border-danger/50">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-4 w-96 bg-black/60 backdrop-blur-2xl rounded-xl shadow-2xl overflow-hidden z-50 border border-white/10 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="py-3 px-4 border-b border-white/10 flex justify-between items-center bg-black/20">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                            <Bell size={14} className="mr-2 text-primary" /> Notifications
                        </h3>
                        {unreadCount > 0 && (
                            <span className="badge badge-danger text-[10px]">{unreadCount} New</span>
                        )}
                    </div>

                    <div className="max-h-[28rem] overflow-y-auto custom-scrollbar">
                        {isLoading && (notifications || []).length === 0 ? (
                            <div className="p-8 text-center text-primary font-mono text-xs animate-pulse">Scanning comms...</div>
                        ) : (notifications || []).length === 0 ? (
                            <div className="p-8 text-center text-text-muted">
                                <Bell size={32} className="mx-auto mb-2 opacity-20" />
                                <p className="text-xs font-mono">No active alerts</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {(notifications || []).map((notification) => (
                                    <div
                                        key={notification._id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`px-4 py-4 cursor-pointer transition-all hover:bg-white/5 flex items-start space-x-3 group relative overflow-hidden
                                            ${!notification.isRead ? 'bg-primary/5' : ''}
                                        `}
                                    >
                                        {!notification.isRead && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                        )}

                                        <div className={`mt-1 p-1.5 rounded-full shrink-0 ${notification.type === 'SUCCESS' ? 'bg-success/20 text-success shadow-[0_0_10px_rgba(16,185,129,0.2)]' :
                                            notification.type === 'WARNING' ? 'bg-warning/20 text-warning shadow-[0_0_10px_rgba(245,158,11,0.2)]' :
                                                notification.type === 'ERROR' ? 'bg-danger/20 text-danger shadow-[0_0_10px_rgba(239,68,68,0.2)]' :
                                                    'bg-primary/20 text-primary shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                            }`}>
                                            {notification.type === 'SUCCESS' ? <CheckCircle size={14} /> :
                                                notification.type === 'WARNING' ? <AlertCircle size={14} /> :
                                                    notification.type === 'ERROR' ? <AlertCircle size={14} /> :
                                                        <Info size={14} />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm mb-1 leading-snug ${!notification.isRead ? 'font-bold text-white' : 'text-text-muted'}`}>
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-text-muted/60 font-mono flex items-center">
                                                <Clock size={10} className="mr-1" />
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-2 bg-black/20 border-t border-white/10 text-center">
                        <button className="text-[10px] text-text-muted hover:text-white uppercase tracking-widest font-bold transition-colors">View All History</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
