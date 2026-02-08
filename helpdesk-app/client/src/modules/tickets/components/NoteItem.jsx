import React from 'react';
import { useSelector } from 'react-redux';

const NoteItem = ({ note }) => {
    const { user } = useSelector((state) => state.auth);

    if (!note) return null;

    const isStaff = note.isStaff;
    // Use optional chaining purely
    const isMe = note.user?._id === user?._id;
    const userName = note.user?.name || 'Unknown User';
    const dateStr = note.createdAt ? new Date(note.createdAt).toLocaleString() : 'Just now';

    return (
        <div
            className={`p-4 rounded-lg mb-4 border ${isStaff ? 'bg-blue-50 border-blue-100 ml-8' : 'bg-slate-50 border-slate-100 mr-8'
                }`}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                    <span className={`text-sm font-bold ${isStaff ? 'text-blue-700' : 'text-slate-700'}`}>
                        {userName}
                        {isStaff && <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded">Staff</span>}
                    </span>
                    <span className="text-xs text-slate-400">
                        {dateStr}
                    </span>
                </div>
            </div>
            <p className="text-slate-700 text-sm whitespace-pre-wrap">{note.text}</p>
        </div>
    );
};

export default NoteItem;
