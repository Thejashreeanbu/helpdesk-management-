import Ticket from './ticket.model.js';
import TicketLog from './ticketLog.model.js';
import User from '../users/user.model.js';
import { ApiError } from '../../utils/apiResponse.js';

// Helper to calculate SLA dates
// ... (calculateSlaDates remains)

import * as emailService from '../../utils/emailService.js';
import * as notificationService from '../notifications/notification.service.js';

const calculateSlaDates = (priority) => {
    const now = new Date();
    let hoursToAdd = 24; // Default Medium
    let escalationHoursBefore = 4; // Default Medium

    switch (priority) {
        case 'Critical':
            hoursToAdd = 4;
            escalationHoursBefore = 1;
            break;
        case 'High':
            hoursToAdd = 8;
            escalationHoursBefore = 2;
            break;
        case 'Medium':
            hoursToAdd = 24;
            escalationHoursBefore = 4;
            break;
        case 'Low':
            hoursToAdd = 48;
            escalationHoursBefore = 6;
            break;
    }

    const slaDueAt = new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);
    const escalationDueAt = new Date(slaDueAt.getTime() - escalationHoursBefore * 60 * 60 * 1000);

    return { slaDueAt, escalationDueAt };
};

export const createTicket = async (ticketData, userId) => {
    // Process attachments if any
    let attachments = [];
    if (ticketData.files && ticketData.files.length > 0) {
        attachments = ticketData.files.map(file => ({
            path: file.path.replace(/\\/g, '/').split('public/')[1], // relative path for frontend
            originalName: file.originalname,
            filename: file.filename,
            mimeType: file.mimetype,
            size: file.size,
            uploader: userId
        }));
    }

    // SLA Calculation
    const { slaDueAt, escalationDueAt } = calculateSlaDates(ticketData.priority || 'Medium');

    const ticket = await Ticket.create({
        ...ticketData,
        slaDueAt,
        escalationDueAt,
        createdBy: userId,
        attachments: attachments
    });

    // Log the creation
    await TicketLog.create({
        ticket: ticket._id,
        action: 'Ticket Created',
        performedBy: userId,
        newValue: ticket.toObject() // Log initial state
    });

    // NOTIFICATIONS
    try {
        // 1. Notify User (Confirmation)
        const user = await User.findById(userId);
        if (user) {
            await emailService.sendEmail({
                to: user.email,
                subject: `Ticket Created: #${ticket._id} - ${ticket.subject}`,
                html: `<p>Your ticket has been created successfully.</p><p><strong>Subject:</strong> ${ticket.subject}</p><p>We will get back to you soon.</p>`
            });
            await notificationService.createNotification(
                userId,
                `Ticket #${ticket._id} created successfully.`,
                'SUCCESS',
                ticket._id
            );
        }
    } catch (err) {
        console.error('Notification failed:', err);
    }

    return ticket;
};

// ... (existing code)

// Make sure to add this function at the end or proper place
export const checkSlaStatus = async () => {
    const now = new Date();
    console.log('Running SLA Check at:', now.toISOString());

    // 1. Check for Escalations (Warning Phase)
    // Find tickets where escalationDueAt is passed, ticket is NOT Escalated, NOT Breached, and NOT Closed/Resolved
    const ticketsToEscalate = await Ticket.find({
        escalationDueAt: { $lte: now },
        status: { $nin: ['Resolved', 'Closed'] },
        isEscalated: false,
        isSlaBreached: false
    });

    for (const ticket of ticketsToEscalate) {
        ticket.isEscalated = true;
        await ticket.save();

        await TicketLog.create({
            ticket: ticket._id,
            action: 'SLA Escalation',
            performedBy: null, // System action
            newValue: { isEscalated: true },
            details: 'Ticket automatically escalated due to approaching SLA deadline.'
        });

        console.log(`Ticket ${ticket._id} Escalated!`);
        // TODO: Send Email Notification to Admin/Manager
        try {
            // In a real app, find all Admins and email them. For now, mock email or specific address
            await emailService.sendEmail({
                to: 'admin@helpdesk.com',
                subject: `URGENT: Ticket #${ticket._id} Escalated`,
                html: `<p>Ticket #${ticket._id} is approaching its SLA deadline.</p>`
            });
            // We can't notify 'performedBy' since it's system, but we can notify ticket assignee if exists
            if (ticket.assignedTo) {
                await notificationService.createNotification(
                    ticket.assignedTo,
                    `URGENT: Ticket #${ticket._id} Escalated (SLA Warning)`,
                    'WARNING',
                    ticket._id
                );
            }
        } catch (err) { console.error(err); }
    }

    // 2. Check for Breaches (Failure Phase)
    // Find tickets where slaDueAt is passed, ticket is NOT Breached, and NOT Closed/Resolved
    const ticketsToBreach = await Ticket.find({
        slaDueAt: { $lte: now },
        status: { $nin: ['Resolved', 'Closed'] },
        isSlaBreached: false
    });

    for (const ticket of ticketsToBreach) {
        ticket.isSlaBreached = true;
        ticket.slaBreachedAt = now;
        await ticket.save();

        await TicketLog.create({
            ticket: ticket._id,
            action: 'SLA Breached',
            // performedBy: null, // System handled by optional schema
            newValue: { isSlaBreached: true },
            details: 'SLA Deadline missed.'
        });

        console.log(`Ticket ${ticket._id} SLA Breached!`);
        // TODO: Notify everyone
        try {
            await emailService.sendEmail({
                to: 'admin@helpdesk.com',
                subject: `SLA BREACH: Ticket #${ticket._id}`,
                html: `<p>Ticket #${ticket._id} has missed its SLA deadline.</p>`
            });
            if (ticket.assignedTo) {
                await notificationService.createNotification(
                    ticket.assignedTo,
                    `SLA BREACHED: Ticket #${ticket._id}`,
                    'ERROR',
                    ticket._id
                );
            }
        } catch (err) { console.error(err); }
    }
};

export const getAllTickets = async (query, user) => {
    let filter = {};

    // RBAC: Filter tickets based on user role
    // Users can only see their own tickets
    if (user.role === 'user') {
        filter.createdBy = user._id;
    }
    else if (user.role === 'agent') {
        // Agents can see tickets assigned to them OR unassigned tickets in their department
        filter.$or = [
            { assignedTo: user._id },
            { department: user.department, assignedTo: null }
        ];
    }
    else if (user.role === 'manager') {
        // Managers see ALL tickets (read-only access to everything)
        // filter = {}; // Explicitly empty to show all
    }
    // Admins and Super-Admins see everything (empty filter base)

    // Apply additional filters from query parameter (status, priority, etc.)
    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;
    // For agents/admins filtering by specific assignee
    if (query.assignedTo) {
        // If they are strictly filtering, we might need to respect that within their allowed scope
        // For simplicity, let's just add it to the filter object
        filter.assignedTo = query.assignedTo;
    }

    const tickets = await Ticket.find(filter)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });

    return tickets;
};

export const getTicketById = async (id, user) => {
    const ticket = await Ticket.findById(id)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email');

    if (!ticket) {
        throw new ApiError(404, 'Ticket not found');
    }

    // Access control: User can only see their own tickets
    if (user.role === 'user' && ticket.createdBy._id.toString() !== user._id.toString()) {
        throw new ApiError(403, 'Not authorized to view this ticket');
    }

    return ticket;
};

export const updateTicket = async (id, updateData, user) => {
    let ticket = await Ticket.findById(id);

    if (!ticket) {
        throw new ApiError(404, 'Ticket not found');
    }

    // User can only update their own tickets (and maybe only specific fields like description or closing it)
    // Agents/Admins can update everything
    if (user.role === 'user' && ticket.createdBy.toString() !== user._id.toString()) {
        throw new ApiError(403, 'Not authorized to update this ticket');
    }

    // AGENT RESTRICTIONS
    if (user.role === 'agent') {
        // Cannot change priority
        if (updateData.priority && updateData.priority !== ticket.priority) {
            throw new ApiError(403, 'Agents cannot change ticket priority');
        }
        // Cannot assign tickets to others (or themselves if not already? Spec says "Cannot Assign tickets")
        // If they try to change assignedTo
        if (updateData.assignedTo && updateData.assignedTo.toString() !== (ticket.assignedTo ? ticket.assignedTo.toString() : '')) {
            throw new ApiError(403, 'Agents cannot assign tickets');
        }
    }

    // MANAGER RESTRICTIONS - Read Only
    if (user.role === 'manager') {
        throw new ApiError(403, 'Managers are not authorized to update tickets');
    }

    const oldValue = ticket.toObject();

    // Process new attachments
    if (updateData.files && updateData.files.length > 0) {
        const newAttachments = updateData.files.map(file => ({
            path: file.path.replace(/\\/g, '/').split('public/')[1],
            originalName: file.originalname,
            filename: file.filename,
            mimeType: file.mimetype,
            size: file.size,
            uploader: user._id
        }));

        // Push new attachments to array
        if (!updateData.$push) updateData.$push = {};
        updateData.$push.attachments = { $each: newAttachments };
    }

    // Since we are using $push via updateData, we need to be careful with findByIdAndUpdate.
    // However, updateData contains 'files' which is not a schema field, we should remove it.
    // Check if assigning to a manager?
    if (updateData.assignedTo) {
        // verify the user exists and is eligible
        const assignee = await User.findById(updateData.assignedTo);
        if (!assignee) {
            throw new ApiError(404, 'Assignee user not found');
        }
        if (assignee.role !== 'agent') {
            throw new ApiError(400, 'Tickets can only be assigned to Agents');
        }

        // Automatic Status Update: If assigning and status is Open, move to In Progress
        if (ticket.status === 'Open' && !updateData.status) {
            updateData.status = 'In Progress';
        }
    }

    delete updateData.files;

    ticket = await Ticket.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    }).populate('createdBy', 'name email').populate('assignedTo', 'name email');

    // Detect important changes for logging (Status, Assignment)
    if (updateData.status && updateData.status !== oldValue.status) {
        await TicketLog.create({
            ticket: id,
            action: 'Status Updated',
            performedBy: user._id,
            oldValue: { status: oldValue.status },
            newValue: { status: updateData.status }
        });

        // NOTIFICATION: Status Change -> Notify Creator
        try {
            const creator = await User.findById(ticket.createdBy);
            if (creator) {
                await emailService.sendEmail({
                    to: creator.email,
                    subject: `Ticket Update: #${ticket._id} is now ${updateData.status}`,
                    html: `<p>Your ticket status has been updated to <strong>${updateData.status}</strong>.</p>`
                });
                await notificationService.createNotification(
                    ticket.createdBy,
                    `Ticket #${ticket._id} status updated to ${updateData.status}`,
                    'INFO',
                    ticket._id
                );
            }
        } catch (err) { console.error(err); }
    }

    if (updateData.assignedTo && updateData.assignedTo.toString() !== (oldValue.assignedTo ? oldValue.assignedTo.toString() : '')) {
        await TicketLog.create({
            ticket: id,
            action: 'Ticket Assigned',
            performedBy: user._id,
            oldValue: { assignedTo: oldValue.assignedTo },
            newValue: { assignedTo: updateData.assignedTo }
        });

        // NOTIFICATION: Assignment -> Notify New Agent
        try {
            const agent = await User.findById(updateData.assignedTo);
            if (agent) {
                await emailService.sendEmail({
                    to: agent.email,
                    subject: `New Assignment: Ticket #${ticket._id}`,
                    html: `<p>You have been assigned to ticket <strong>#${ticket._id}</strong>.</p><p>Subject: ${ticket.subject}</p>`
                });
                await notificationService.createNotification(
                    updateData.assignedTo,
                    `You have been assigned to Ticket #${ticket._id}`,
                    'INFO',
                    ticket._id
                );
            }
        } catch (err) { console.error(err); }
    }

    // Generic log if it wasn't one of the above, or added as extra detail? 
    // keeping it simple for now, only logging critical transitions.

    return ticket;
};

export const deleteTicket = async (id, user) => {
    // Only Admin can delete tickets usually
    if (user.role !== 'admin' && user.role !== 'super-admin') {
        throw new ApiError(403, 'Not authorized to delete tickets');
    }
    const ticket = await Ticket.findByIdAndDelete(id);
    if (!ticket) {
        throw new ApiError(404, 'Ticket not found');
    }
    return ticket;
};

export const getTicketLogs = async (ticketId, user) => {
    // Re-using access control logic often is good, but let's trust the controller to check existence first? 
    // Actually, good practice to check access here too or assume controller did it. 
    // For safety let's just fetch it. Access check should be consistent with getTicketById.

    // Check ticket existence
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new ApiError(404, 'Ticket not found');

    // Strict Access Check: Admin, Super-Admin AND Agents can see history (per spec)
    if (!['admin', 'super-admin', 'agent'].includes(user.role)) {
        throw new ApiError(403, 'Not authorized to view ticket history');
    }

    return await TicketLog.find({ ticket: ticketId })
        .populate('performedBy', 'name')
        .sort({ createdAt: -1 });
};
