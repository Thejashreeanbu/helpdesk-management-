import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTickets, reset } from '../ticketSlice';
import { Plus, Ticket, CheckCircle, Clock, AlertTriangle, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const StatCard = ({ title, value, icon: Icon, color, glowColor, trend }) => (
    <div className="glass-card p-6 relative overflow-hidden group">
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500`}>
            <Icon size={100} className={color} />
        </div>

        <div className="relative z-10 flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-text-muted mb-1 tracking-wide uppercase">{title}</p>
                <h3 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg">{value}</h3>
                {trend && (
                    <p className="text-xs text-success mt-2 font-mono flex items-center">
                        <Activity size={12} className="mr-1" /> {trend} this week
                    </p>
                )}
            </div>
            <div className={`p-3 rounded-xl bg-white/5 border border-white/10 shadow-[0_0_15px_${glowColor}]`}>
                <Icon size={24} className={color} />
            </div>
        </div>

        {/* Bottom Glow Bar */}
        <div className={`absolute bottom-0 left-0 w-full h-1 opacity-50 ${color.replace('text-', 'bg-')} shadow-[0_0_10px_${glowColor}]`}></div>
    </div>
);

const DashboardPage = () => {
    const dispatch = useDispatch();
    const { tickets, isLoading, isError, message } = useSelector((state) => state.tickets);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isError) console.log(message);
        dispatch(getTickets());
        return () => { dispatch(reset()); }
    }, [dispatch, isError, message]);

    if (isLoading) return <div className="p-8 text-center text-primary animate-pulse font-mono">Loading system data...</div>;

    const openTickets = tickets.filter(t => t.status === 'Open').length;
    const resolvedTickets = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
    const inProgressTickets = tickets.filter(t => t.status === 'In Progress').length;
    const highPriorityTickets = tickets.filter(t => t.priority === 'High' || t.priority === 'Critical').length;

    // Simple Data for Chart
    const data = [
        { name: 'Open', value: openTickets, color: '#f59e0b' },
        { name: 'In Progress', value: inProgressTickets, color: '#3b82f6' },
        { name: 'Resolved', value: resolvedTickets, color: '#10b981' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 drop-shadow-sm">
                        Dashboard
                    </h1>
                    <p className="text-text-muted mt-1 font-mono text-xs tracking-wider">Here's what's happening with your tickets today.</p>
                </div>
                {['user', 'admin', 'super-admin'].includes(user?.role) && (
                    <Link to="/new-ticket" className="btn btn-primary group">
                        <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                        <span>New Ticket</span>
                    </Link>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Tickets"
                    value={tickets.length}
                    icon={Ticket}
                    color="text-blue-400"
                    glowColor="rgba(96,165,250,0.5)"
                    trend="+12%"
                />
                <StatCard
                    title="Open Tickets"
                    value={openTickets + inProgressTickets}
                    icon={Clock}
                    color="text-orange-400"
                    glowColor="rgba(251,146,60,0.5)"
                />
                <StatCard
                    title="High Priority"
                    value={highPriorityTickets}
                    icon={AlertTriangle}
                    color="text-red-400"
                    glowColor="rgba(248,113,113,0.5)"
                />
                <StatCard
                    title="Resolved"
                    value={resolvedTickets}
                    icon={CheckCircle}
                    color="text-green-400"
                    glowColor="rgba(74,222,128,0.5)"
                    trend="+5%"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Tickets Table */}
                <div className="glass-panel rounded-2xl overflow-hidden lg:col-span-2 flex flex-col">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <h3 className="font-bold text-white text-lg flex items-center">
                            <Activity size={20} className="mr-2 text-primary" />
                            Recent Tickets
                        </h3>
                        <Link to="/tickets" className="text-xs text-primary hover:text-blue-400 font-mono uppercase tracking-widest border border-primary/30 px-2 py-1 rounded hover:bg-primary/10 transition-colors">
                            View all
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black/20 text-text-muted text-xs uppercase tracking-wider font-semibold">
                                    <th className="px-6 py-4">Subject</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Priority</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {tickets.slice(0, 5).map((ticket) => (
                                    <tr key={ticket._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white group-hover:text-primary transition-colors">{ticket.subject}</div>
                                            <div className="text-xs text-slate-500 mt-0.5 truncate max-w-xs font-mono">{ticket._id.slice(-6).toUpperCase()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`badge ${ticket.status === 'Open' ? 'badge-warning' :
                                                ticket.status === 'Resolved' || ticket.status === 'Closed' ? 'badge-success' :
                                                    ticket.status === 'In Progress' ? 'badge-info' : 'badge-neutral'
                                                }`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold uppercase tracking-wider
                                                ${ticket.priority === 'High' || ticket.priority === 'Critical' ? 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]' :
                                                    ticket.priority === 'Medium' ? 'text-orange-400' : 'text-slate-400'}
                                            `}>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link to={`/ticket/${ticket._id}`} className="btn-ghost px-3 py-1 rounded text-xs uppercase font-bold tracking-wider border border-white/10 hover:border-primary/50 hover:text-primary transition-all">
                                                Manage
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {tickets.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-12 text-slate-500 font-mono">
                                            <Ticket size={48} className="mx-auto mb-3 opacity-20" />
                                            <p>NO DATA AVAILABLE</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mini Chart */}
                <div className="glass-panel rounded-2xl p-6 flex flex-col">
                    <h3 className="font-bold text-white text-lg mb-6">Distribution</h3>
                    <div className="flex-1 min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                            <span className="block text-2xl font-bold text-success">{resolvedTickets}</span>
                            <span className="text-xs text-text-muted uppercase tracking-wider">Resolved</span>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                            <span className="block text-2xl font-bold text-warning">{openTickets}</span>
                            <span className="text-xs text-text-muted uppercase tracking-wider">Pending</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
