import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTickets, reset } from '../ticketSlice';
import { Search, Filter, RefreshCw, Plus, Ticket } from 'lucide-react';

const TicketsPage = () => {
    const dispatch = useDispatch();
    const { tickets, isLoading } = useSelector((state) => state.tickets);
    const { user } = useSelector((state) => state.auth);

    // Local state for client-side filtering (ideally would be server-side for scale)
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(getTickets());
        return () => { dispatch(reset()); };
    }, [dispatch]);

    const filteredTickets = tickets.filter(ticket => {
        const matchesStatus = filterStatus === 'All' || ticket.status === filterStatus;
        const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    if (isLoading) return <div className="p-8 text-center text-primary animate-pulse font-mono">Loading ticket data...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">All Tickets</h1>
                </div>

                {['user', 'admin', 'super-admin'].includes(user?.role) && (
                    <Link to="/new-ticket" className="btn btn-primary group">
                        <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                        <span>New Ticket</span>
                    </Link>
                )}
            </div>

            {/* Filters & Search */}
            <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="input-field pl-10 py-2 appearance-none cursor-pointer hover:bg-white/5 transition-colors"
                        >
                            <option value="All" className="bg-slate-800 text-white">All Statuses</option>
                            <option value="Open" className="bg-slate-800 text-white">Open</option>
                            <option value="In Progress" className="bg-slate-800 text-white">In Progress</option>
                            <option value="Waiting for Customer" className="bg-slate-800 text-white">Waiting for Customer</option>
                            <option value="Resolved" className="bg-slate-800 text-white">Resolved</option>
                            <option value="Closed" className="bg-slate-800 text-white">Closed</option>
                        </select>
                    </div>

                    <button
                        onClick={() => dispatch(getTickets())}
                        className="btn btn-secondary p-2.5"
                        title="Refresh"
                    >
                        <RefreshCw size={18} className="hover:rotate-180 transition-transform duration-500" />
                    </button>
                </div>
            </div>

            {/* Tickets Table */}
            <div className="glass-panel rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/20 text-text-muted uppercase text-xs font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Subject</th>
                                <th className="px-6 py-4">Requester</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredTickets.map((ticket) => (
                                <tr key={ticket._id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white group-hover:text-primary transition-colors">{ticket.subject}</div>
                                        <div className="text-xs text-text-muted mt-0.5 font-mono">ID: {ticket._id.slice(-6).toUpperCase()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-white font-medium text-sm">{ticket.createdBy?.name || 'Unknown'}</div>
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
                                    <td className="px-6 py-4 text-sm text-text-muted">
                                        <span className="bg-white/5 px-2 py-1 rounded text-xs uppercase font-mono">{ticket.department || 'General'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-text-muted font-mono">
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link to={`/ticket/${ticket._id}`} className="btn-ghost px-3 py-1 rounded text-xs uppercase font-bold tracking-wider border border-white/10 hover:border-primary/50 hover:text-primary transition-all">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filteredTickets.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center py-16 text-text-muted">
                                        <div className="flex flex-col items-center opacity-50">
                                            <Ticket size={48} className="mb-4" />
                                            <p className="font-mono text-lg">NO MATCHING RECORDS</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TicketsPage;
