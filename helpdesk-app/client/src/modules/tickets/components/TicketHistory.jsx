import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTicketHistory } from '../ticketSlice';
import { Activity, Clock, User, ChevronRight, FileText, AlertTriangle } from 'lucide-react';

function TicketHistory({ ticketId }) {
    const { history, isLoading } = useSelector((state) => state.tickets);
    const dispatch = useDispatch();

    useEffect(() => {
        if (ticketId) {
            dispatch(getTicketHistory(ticketId));
        }
    }, [dispatch, ticketId]);

    if (isLoading) {
        return <div className="text-center py-8 text-primary animate-pulse font-mono tracking-widest text-xs">LOADING SYSTEM LOGS...</div>;
    }

    return (
        <div className='space-y-4'>
            {/* <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center">
                <Activity size={14} className="mr-2" /> Ticket History
            </h3> */}

            <div className='relative space-y-0'>
                {/* Timeline vertical line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10 ml-px md:ml-0"></div>

                {history && history.length > 0 ? (
                    history.map((log, index) => (
                        <div key={log._id} className='relative pl-12 pb-8 group last:pb-0'>
                            {/* Timestamp Marker */}
                            <div className="absolute left-1 md:-left-1.5 top-0 w-3 h-3 rounded-full bg-black border border-primary/50 group-hover:bg-primary group-hover:shadow-[0_0_10px_rgba(59,130,246,0.6)] transition-all z-10 mt-1.5"></div>

                            <div className='bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 hover:border-white/10 transition-all'>
                                <div className='flex justify-between items-start mb-2'>
                                    <div className="flex items-center">
                                        <span className='font-bold text-white text-sm mr-2'>{log.action}</span>
                                    </div>
                                    <span className='font-mono text-xs text-text-muted flex items-center'>
                                        <Clock size={10} className="mr-1" />
                                        {new Date(log.createdAt).toLocaleString('en-US')}
                                    </span>
                                </div>

                                <div className='text-sm text-text-muted space-y-2'>
                                    <div className="flex items-center text-xs">
                                        <User size={12} className="mr-1.5 text-secondary" />
                                        <span>Performed by: <span className="text-slate-300 font-medium">{log.performedBy ? log.performedBy.name : 'Unknown'}</span></span>
                                    </div>

                                    {log.oldValue && log.newValue && (
                                        <div className='bg-black/20 rounded-lg p-3 space-y-2 mt-2 border border-white/5 font-mono text-xs'>
                                            {Object.keys(log.newValue).map((key) => {
                                                const oldVal = JSON.stringify(log.oldValue[key]);
                                                const newVal = JSON.stringify(log.newValue[key]);

                                                if (oldVal !== newVal) {
                                                    return (
                                                        <div key={key} className='flex flex-wrap items-center gap-2'>
                                                            <span className='text-prob uppercase font-bold text-secondary'>{key}:</span>
                                                            <span className='text-danger/80 line-through decoration-danger/50'>{oldVal || 'null'}</span>
                                                            <ChevronRight size={10} className="text-text-muted" />
                                                            <span className='text-success'>{newVal || 'null'}</span>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    )}

                                    {/* Note Preview */}
                                    {log.action.includes('Note') && log.newValue?.text && (
                                        <div className='mt-2 flex items-start p-3 bg-primary/5 border border-primary/10 rounded-lg italic text-slate-300'>
                                            <FileText size={14} className="mr-2 mt-0.5 text-primary shrink-0" />
                                            "{log.newValue.text}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="glass-panel p-8 text-center rounded-xl border-dashed border-white/10">
                        <AlertTriangle size={32} className="mx-auto text-text-muted mb-2 opacity-50" />
                        <p className="text-text-muted font-mono text-xs">No history logs available for this ticket.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TicketHistory;
