import mongoose from 'mongoose';

const ticketLogSchema = new mongoose.Schema({
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true // Can be null for system actions
    },
    oldValue: {
        type: Object
    },
    newValue: {
        type: Object
    },
}, {
    timestamps: true
});

export default mongoose.model('TicketLog', ticketLogSchema);
