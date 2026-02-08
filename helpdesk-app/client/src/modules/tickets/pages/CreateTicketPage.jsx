import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createTicket, reset } from '../ticketSlice';
import { FileText, Send, User, Mail, Paperclip, Tag, AlertTriangle } from 'lucide-react';

const CreateTicketPage = () => {
    const { user } = useSelector((state) => state.auth);
    const { isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.tickets
    );

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name] = useState(user.name);
    const [email] = useState(user.email);

    // Redirect if agent
    React.useEffect(() => {
        if (user && user.role === 'agent') {
            navigate('/');
        }
    }, [user, navigate]);

    const [formData, setFormData] = useState({
        product: 'General',
        description: '',
        subject: '',
        priority: 'Medium',
        type: 'General Inquiry',
        attachments: [],
    });

    const { product, description, subject, priority, type, attachments } = formData;

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(createTicket({ product, description, subject, priority, type, attachments }));
        navigate('/');
    };

    const onChange = (e) => {
        if (e.target.name === 'attachments') {
            setFormData((prevState) => ({
                ...prevState,
                attachments: e.target.files,
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }));
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-primary animate-pulse font-mono">INITIATING TICKET CREATION...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">New Support Ticket</h1>
                <p className="text-text-muted">Submit a new request to the helpdesk.</p>
            </div>

            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                    <FileText size={200} className="text-white" />
                </div>

                {/* User Info Section */}
                <div className="bg-black/20 rounded-xl p-4 border border-white/5 mb-8 flex flex-col md:flex-row gap-4">
                    <div className="flex items-center space-x-3 flex-1 bg-white/5 p-3 rounded-lg border border-white/5">
                        <User className="text-primary" size={18} />
                        <div>
                            <label className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">Name</label>
                            <p className="text-white font-medium text-sm">{name}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 flex-1 bg-white/5 p-3 rounded-lg border border-white/5">
                        <Mail className="text-secondary" size={18} />
                        <div>
                            <label className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">Email</label>
                            <p className="text-white font-medium text-sm">{email}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="space-y-6 relative z-10">
                    <div>
                        <label htmlFor="subject" className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Subject</label>
                        <input
                            type="text"
                            name="subject"
                            id="subject"
                            className="input-field bg-black/20 border-white/10 focus:bg-black/40 text-lg"
                            placeholder="Brief summary of the issue..."
                            value={subject}
                            onChange={onChange}
                            required
                            maxLength={100}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={user?.role === 'user' ? 'md:col-span-2' : ''}>
                            <label htmlFor="type" className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Ticket Type</label>
                            <div className="relative">
                                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <select
                                    name="type"
                                    id="type"
                                    className="input-field pl-12 bg-black/20 border-white/10 focus:bg-black/40 appearance-none cursor-pointer"
                                    value={type}
                                    onChange={onChange}
                                >
                                    <option value="General Inquiry" className="bg-slate-900">General Inquiry</option>
                                    <option value="Technical Support" className="bg-slate-900">Technical Support</option>
                                    <option value="Billing Issue" className="bg-slate-900">Billing Issue</option>
                                    <option value="Access Issue" className="bg-slate-900">Access Issue</option>
                                    <option value="Feature Request" className="bg-slate-900">Feature Request</option>
                                </select>
                            </div>
                        </div>

                        {/* Priority - Only Admin/Agent can manually set priority */}
                        {user?.role !== 'user' && (
                            <div>
                                <label htmlFor="priority" className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Priority</label>
                                <div className="relative">
                                    <AlertTriangle className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <select
                                        name="priority"
                                        id="priority"
                                        className="input-field pl-12 bg-black/20 border-white/10 focus:bg-black/40 appearance-none cursor-pointer"
                                        value={priority}
                                        onChange={onChange}
                                    >
                                        <option value="Low" className="bg-slate-900">Low Priority</option>
                                        <option value="Medium" className="bg-slate-900">Medium Priority</option>
                                        <option value="High" className="bg-slate-900">High Priority</option>
                                        <option value="Critical" className="bg-slate-900">Critical Priority</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Description</label>
                        <textarea
                            name="description"
                            id="description"
                            className="input-field bg-black/20 border-white/10 focus:bg-black/40 h-40 resize-none leading-relaxed"
                            placeholder="Please provide as much detail as possible to help us assist you..."
                            value={description}
                            onChange={onChange}
                            required
                        ></textarea>
                    </div>

                    {/* File Attachment - Only for Users */}
                    {
                        user.role === 'user' && (
                            <div>
                                <label htmlFor="attachments" className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Attachments</label>
                                <div className="border border-dashed border-white/20 rounded-xl p-6 text-center hover:bg-white/5 transition-colors cursor-pointer relative bg-black/10">
                                    <input
                                        type="file"
                                        name="attachments"
                                        id="attachments"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        multiple
                                        onChange={onChange}
                                    />
                                    <Paperclip className="mx-auto text-text-muted mb-2" size={24} />
                                    <p className="text-sm text-white font-medium">Click to upload or drag and drop</p>
                                    <p className="text-xs text-text-muted mt-1">Images, PDF, Logs (Max 5 files)</p>
                                    {attachments && attachments.length > 0 && (
                                        <div className="mt-2 text-primary font-mono text-xs">
                                            {attachments.length} file(s) selected
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    }

                    <div className="flex justify-end space-x-4 pt-4 border-t border-white/5">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="px-6 py-3 rounded-xl border border-white/10 text-text-muted hover:text-white hover:bg-white/5 transition-colors text-sm font-bold uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center"
                        >
                            <span>Submit Ticket</span>
                            <Send size={16} className="ml-2" />
                        </button>
                    </div>
                </form >
            </div>
        </div >
    );
};

export default CreateTicketPage;
