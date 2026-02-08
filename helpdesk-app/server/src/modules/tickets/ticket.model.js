import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: [true, 'Please provide a subject'],
        trim: true,
        maxlength: [100, 'Subject cannot be more than 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Waiting for Customer', 'Resolved', 'Closed'],
        default: 'Open',
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium',
    },
    type: {
        type: String,
        enum: ['Incident', 'Service Request', 'Billing Issue', 'Technical Support', 'Access Issue', 'Feature Request', 'General Inquiry'],
        default: 'Incident'
    },
    department: {
        type: String,
        enum: ['Global', 'IT', 'HR', 'Sales', 'Support', 'General', 'Finance'],
        default: 'General'
    },
    // SLA Fields
    slaDueAt: {
        type: Date,
    },
    escalationDueAt: { // Time when it should be escalated to admin (Before Breach)
        type: Date,
    },
    isEscalated: {
        type: Boolean,
        default: false,
    },
    isSlaBreached: {
        type: Boolean,
        default: false,
    },
    slaBreachedAt: {
        type: Date,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    // We will add attachment support later in Module 4
    attachments: [{
        path: String,
        originalName: String,
        filename: String,
        mimeType: String,
        size: Number,
        uploader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
}, {
    timestamps: true,
});

// Indexes for performance
ticketSchema.index({ status: 1 });
ticketSchema.index({ priority: 1 });
ticketSchema.index({ assignedTo: 1 });
ticketSchema.index({ createdAt: -1 }); // For sorting by latest
ticketSchema.index({ status: 1, priority: 1 }); // For filtering by both

export default mongoose.model('Ticket', ticketSchema);
