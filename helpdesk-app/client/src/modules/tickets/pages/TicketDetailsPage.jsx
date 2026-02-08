import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getNotes, createNote, reset as notesReset } from '../noteSlice';
import NoteItem from '../components/NoteItem';
import { closeTicket, updateTicket } from '../ticketSlice'; // Thunk
import ticketService from '../ticket.service';
import { getUsers } from '../../users/usersSlice';
import TicketHistory from '../components/TicketHistory';
import { Clock, User, FileText, Send, MessageSquare, Shield, MoreVertical, ArrowLeft, Paperclip, CheckCircle, AlertTriangle, Ticket } from 'lucide-react';

const TicketDetailsPage = () => {
    const { ticketId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Safe selection with fallback
    const noteState = useSelector((state) => state.notes);
    const notes = noteState?.notes || [];
    const notesIsLoading = noteState?.isLoading || false;

    const { user } = useSelector((state) => state.auth);
    const { users } = useSelector((state) => state.users);

    // Ticket state
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    // Note form state
    const [noteText, setNoteText] = useState('');

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const data = await ticketService.getTicket(ticketId);
                setTicket(data);
            } catch (err) {
                console.error(err);
                toast.error('Could not fetch ticket');
                navigate('/tickets');
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
        dispatch(getNotes(ticketId));

        // Fetch users if admin/super-admin to allow assignment
        if (user && (user.role === 'admin' || user.role === 'super-admin')) {
            dispatch(getUsers());
        }

    }, [ticketId, navigate, dispatch, user?.role]);

    const onTicketClose = () => {
        if (window.confirm('Are you sure you want to close this ticket?')) {
            dispatch(closeTicket(ticketId))
                .unwrap()
                .then(() => {
                    toast.success('Ticket Closed Successfully');
                    setTicket(prev => ({ ...prev, status: 'Resolved' }));
                })
                .catch(toast.error);
        }
    };

    const onTicketResolve = () => {
        if (window.confirm('Are you sure you want to mark this ticket as resolved?')) {
            dispatch(updateTicket({ ticketId, ticketData: { status: 'Resolved' } }))
                .unwrap()
                .then((updatedTicket) => {
                    toast.success('Ticket Resolved Successfully');
                    setTicket(updatedTicket);
                })
                .catch(toast.error);
        }
    };

    const onAssignChange = (e) => {
        const agentId = e.target.value;
        dispatch(updateTicket({ ticketId, ticketData: { assignedTo: agentId } }))
            .unwrap()
            .then((updatedTicket) => {
                toast.success(`Ticket assigned successfully`);
                setTicket(updatedTicket);
            })
            .catch(toast.error);
    };

    const onStatusChange = (e) => {
        const newStatus = e.target.value;
        const previousStatus = ticket.status;

        // Optimistic update
        setTicket(prev => ({ ...prev, status: newStatus }));

        dispatch(updateTicket({ ticketId, ticketData: { status: newStatus } }))
            .unwrap()
            .then((updatedTicket) => {
                toast.success(`Ticket status updated to ${newStatus}`);
                setTicket(updatedTicket);
            })
            .catch((err) => {
                toast.error(err);
                // Revert on failure
                setTicket(prev => ({ ...prev, status: previousStatus }));
            });
    };

    const [activeTab, setActiveTab] = useState('details');

    const publicNotes = notes.filter(n => !n.isInternal);
    const internalNotes = notes.filter(n => n.isInternal);

    const onNoteSubmit = (e, isInternal = false) => {
        e.preventDefault();
        if (!noteText) return;

        dispatch(createNote({ ticketId, noteText, isInternal }))
            .unwrap()
            .then(() => {
                toast.success('Note added');
                setNoteText('');
            })
            .catch(toast.error);
    };

    if (loading) return <div className="p-8 text-center text-primary animate-pulse font-mono">INITIALIZING TICKET INTERFACE...</div>;
    if (!ticket) return <div className="p-8 text-center text-danger font-mono">ERROR: TICKET NOT FOUND</div>;

    const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';
    const isStaff = user?.role !== 'user';
    const agents = users.filter(u => u.role === 'agent');

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header / Nav */}
            <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl backdrop-blur-sm border border-white/5">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-text-muted hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} className="mr-2" />
                    <span className="font-mono text-sm uppercase tracking-widest">Back to Registry</span>
                </button>
                <div className="font-mono text-xs text-text-muted">
                    SYSTEM ID: {ticket._id}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Ticket Header */}
                    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Ticket size={120} className="text-white" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-4">
                                <span className={`badge ${ticket.status === 'Open' ? 'badge-warning' :
                                    ticket.status === 'Resolved' ? 'badge-success' :
                                        ticket.status === 'In Progress' ? 'badge-info' : 'badge-neutral'
                                    }`}>
                                    {ticket.status}
                                </span>
                                <span className="font-mono text-text-muted text-sm">
                                    {new Date(ticket.createdAt).toLocaleString()}
                                </span>
                            </div>

                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                                {ticket.subject}
                            </h1>

                            <div className="flex items-center space-x-2 text-sm text-text-muted">
                                <User size={14} />
                                <span>Requested by <span className="text-white font-semibold">{ticket.createdBy?.name || 'Unknown'}</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex p-1 bg-black/20 rounded-xl">
                        <button
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'details' ? 'bg-primary/20 text-white shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 'text-text-muted hover:text-white'}`}
                            onClick={() => setActiveTab('details')}
                        >
                            DETAILS
                        </button>
                        <button
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'messages' ? 'bg-primary/20 text-white shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 'text-text-muted hover:text-white'}`}
                            onClick={() => setActiveTab('messages')}
                        >
                            COMMUNICATION ({publicNotes.length})
                        </button>
                        {isStaff && (
                            <button
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'internal' ? 'bg-warning/20 text-warning shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'text-text-muted hover:text-white'}`}
                                onClick={() => setActiveTab('internal')}
                            >
                                INTERNAL ({internalNotes.length})
                            </button>
                        )}
                        {isStaff && (
                            <button
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'history' ? 'bg-primary/20 text-white shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 'text-text-muted hover:text-white'}`}
                                onClick={() => setActiveTab('history')}
                            >
                                AUDIT
                            </button>
                        )}
                    </div>

                    {/* DETAILS TAB */}
                    {activeTab === 'details' && (
                        <div className="glass-panel p-6 rounded-2xl min-h-[300px]">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center">
                                <FileText size={14} className="mr-2" /> Description
                            </h3>
                            <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
                                {ticket.description}
                            </div>

                            {ticket.attachments && ticket.attachments.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center">
                                        <Paperclip size={14} className="mr-2" /> Attachments
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {ticket.attachments.map((file, index) => (
                                            <a
                                                key={index}
                                                href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${file.path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group"
                                            >
                                                <div className="bg-primary/20 p-2 rounded text-primary mr-3 group-hover:bg-primary/30 group-hover:text-white transition-colors">
                                                    <FileText size={18} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-white truncate">{file.originalName}</p>
                                                    <p className="text-xs text-text-muted">{Math.round(file.size / 1024)} KB</p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* MESSAGES TAB */}
                    {activeTab === 'messages' && (
                        <div className="glass-panel p-6 rounded-2xl">
                            <div className="space-y-6 mb-8 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                                {publicNotes.length > 0 ? (
                                    publicNotes.map((note) => (
                                        <div key={note._id} className={`flex ${note.isStaff ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] rounded-2xl p-4 relative ${note.isStaff
                                                ? 'bg-primary/20 border border-primary/30 text-white rounded-tr-none'
                                                : 'bg-white/10 border border-white/5 text-slate-200 rounded-tl-none'
                                                }`}>
                                                <div className="flex items-center space-x-2 mb-1 text-xs opacity-70">
                                                    <span className="font-bold">{note.staffId ? note.staffId.name : note.userId?.name}</span>
                                                    <span>•</span>
                                                    <span>{new Date(note.createdAt).toLocaleString()}</span>
                                                </div>
                                                <p className="whitespace-pre-wrap">{note.text}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 opacity-30">
                                        <MessageSquare size={48} className="mx-auto mb-3" />
                                        <p className="font-mono text-sm">NO TRANSMISSIONS LOGGED</p>
                                    </div>
                                )}
                            </div>

                            {ticket.status !== 'Closed' && (
                                <form onSubmit={(e) => onNoteSubmit(e, false)} className="relative">
                                    <textarea
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 pr-16 text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                                        placeholder="Type your message..."
                                        rows="3"
                                        value={noteText}
                                        onChange={(e) => setNoteText(e.target.value)}
                                    ></textarea>
                                    <button
                                        type="submit"
                                        className="absolute bottom-3 right-3 p-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-primary transition-colors shadow-lg shadow-primary/20"
                                        disabled={!noteText}
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {/* INTERNAL NOTES TAB */}
                    {activeTab === 'internal' && isStaff && (
                        <div className="glass-panel p-6 rounded-2xl border-warning/20">
                            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-6 flex items-center">
                                <Shield className="text-warning mr-3" size={20} />
                                <p className="text-warning text-xs font-bold uppercase tracking-wider">Restricted Access: Internal Staff Communication Only</p>
                            </div>

                            <div className="space-y-4 mb-8 max-h-[500px] overflow-y-auto custom-scrollbar">
                                {internalNotes.length > 0 ? (
                                    internalNotes.map((note) => (
                                        <div key={note._id} className="bg-warning/5 border border-warning/10 p-4 rounded-xl">
                                            <div className="flex items-center justify-between mb-2 text-xs text-warning/70">
                                                <span className="font-bold">{note.staffId?.name}</span>
                                                <span>{new Date(note.createdAt).toLocaleString()}</span>
                                            </div>
                                            <p className="text-slate-200 text-sm whitespace-pre-wrap">{note.text}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-text-muted italic py-8">No internal notes.</p>
                                )}
                            </div>

                            <form onSubmit={(e) => onNoteSubmit(e, true)}>
                                <div className="space-y-3">
                                    <textarea
                                        className="w-full bg-black/20 border border-warning/20 rounded-xl p-4 text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-warning/50 transition-all resize-none"
                                        placeholder="Add secure internal note..."
                                        rows="3"
                                        value={noteText}
                                        onChange={(e) => setNoteText(e.target.value)}
                                    ></textarea>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="bg-warning/20 text-warning border border-warning/20 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-warning/30 transition-colors"
                                            disabled={!noteText}
                                        >
                                            Log Internal Note
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* AUDIT HISTORY TAB */}
                    {activeTab === 'history' && isStaff && (
                        <div className="glass-panel p-6 rounded-2xl">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center">
                                <Clock size={14} className="mr-2" /> System Logs
                            </h3>
                            <TicketHistory ticketId={ticketId} />
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* SLA Status Card */}
                    {ticket.slaDueAt && (
                        <div className={`glass-card p-5 relative overflow-hidden border ${ticket.isSlaBreached ? 'border-danger/50' : ticket.isEscalated ? 'border-warning/50' : 'border-success/50'}`}>
                            <div className="flex items-center mb-3">
                                {ticket.isSlaBreached ? <AlertTriangle className="text-danger mr-2" /> : <Clock className="text-success mr-2" />}
                                <h3 className={`font-bold uppercase tracking-wider text-sm ${ticket.isSlaBreached ? 'text-danger' : 'text-success'}`}>
                                    {ticket.isSlaBreached ? 'SLA BREACHED' : 'SLA ACTIVE'}
                                </h3>
                            </div>

                            <div className="mb-4">
                                <div className="text-xs text-text-muted mb-1">Target Resolution</div>
                                <div className="font-mono text-white text-sm">{new Date(ticket.slaDueAt).toLocaleString()}</div>
                            </div>

                            {!ticket.isSlaBreached && ticket.status !== 'Resolved' && (
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-text-muted">Time Remaining</span>
                                        <span className="text-white font-mono font-bold">
                                            {(() => {
                                                const diff = new Date(ticket.slaDueAt) - new Date();
                                                if (diff <= 0) return '0h 0m';
                                                const hours = Math.floor(diff / (1000 * 60 * 60));
                                                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                                return `${hours}h ${minutes}m`;
                                            })()}
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-gradient-to-r from-primary to-secondary h-full w-[75%] rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Metadata Card */}
                    <div className="glass-panel p-5 rounded-xl space-y-4">
                        <div className="pb-4 border-b border-white/5">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-1">Assigned Agent</label>
                            {isAdmin ? (
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User size={14} className="text-primary group-hover:text-white transition-colors" />
                                    </div>
                                    <select
                                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 appearance-none transition-all hover:bg-black/60 hover:border-white/20 cursor-pointer"
                                        value={ticket.assignedTo?._id || ticket.assignedTo || ''}
                                        onChange={onAssignChange}
                                    >
                                        <option value="" className="bg-slate-900 text-text-muted">-- Unassigned --</option>
                                        {agents.map(agent => (
                                            <option key={agent._id} value={agent._id} className="bg-slate-900 text-white">
                                                {agent.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-white/50"></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-[10px] font-bold text-white">
                                        {ticket.assignedTo?.name?.charAt(0) || '?'}
                                    </div>
                                    <span className="text-white font-medium text-sm">{ticket.assignedTo?.name || 'Unassigned'}</span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-1">Priority</label>
                                <span className={`text-sm font-bold ${ticket.priority === 'High' || ticket.priority === 'Critical' ? 'text-danger drop-shadow-md' :
                                    ticket.priority === 'Medium' ? 'text-warning' : 'text-slate-300'
                                    }`}>
                                    {ticket.priority}
                                </span>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-1">Type</label>
                                <span className="text-sm text-white">{ticket.type}</span>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-1">Dept</label>
                                <span className="text-sm text-white">{ticket.department}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions Card */}
                    <div className="glass-panel p-5 rounded-xl space-y-3">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-2">Actions</label>

                        {(isAdmin || user?.role === 'agent') && ticket.status !== 'Closed' && (
                            <select
                                value={ticket.status}
                                onChange={onStatusChange}
                                className="w-full bg-primary/10 border border-primary/20 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer hover:bg-primary/20 transition-colors"
                            >
                                <option value="Open" className="bg-slate-800">Set: Open</option>
                                <option value="In Progress" className="bg-slate-800">Set: In Progress</option>
                                <option value="Waiting for Customer" className="bg-slate-800">Set: Waiting</option>
                                <option value="Resolved" className="bg-slate-800">Set: Resolved</option>
                            </select>
                        )}

                        {user?.role === 'user' && ticket.status !== 'Closed' && (
                            <button
                                onClick={onTicketClose}
                                className="w-full btn btn-secondary text-sm"
                            >
                                Close Ticket
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetailsPage;
