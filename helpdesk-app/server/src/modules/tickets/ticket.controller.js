import Ticket from './ticket.model.js'; // Needed if we use it directly, but service handles it. 
// We need User for auto-assignment lookup
import User from '../users/user.model.js';
import * as ticketService from './ticket.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

// @desc    Create new ticket
// @route   POST /api/v1/tickets
// @access  Private
export const createTicket = async (req, res, next) => {
    try {
        const tickData = { ...req.body };

        // Auto-Assignment Logic (For 'user' role mainly, or if fields missing)
        // If user is restricted (e.g. 'user'), they cannot set priority/department manually ideally,
        // but even if they send it, we might want to override or respect.
        // Requirement: "I still want the admin and super admin to be able to assign and reassign"
        // So: If Admin/SuperAdmin sends priority/department/assignedTo, we keep it.
        // If User (or fields missing), we auto-assign.

        const isPrivileged = ['admin', 'super-admin'].includes(req.user.role);

        const typeMapping = {
            'Billing Issue': { dept: 'Finance', prio: 'Medium' },
            'Technical Support': { dept: 'IT', prio: 'High' },
            'Access Issue': { dept: 'IT', prio: 'Critical' },
            'Feature Request': { dept: 'IT', prio: 'Low' },
            'General Inquiry': { dept: 'Support', prio: 'Low' },
            'Incident': { dept: 'Support', prio: 'Medium' },
            'Service Request': { dept: 'Support', prio: 'Medium' }
        };

        const mapping = typeMapping[tickData.type] || typeMapping['General Inquiry'];

        // 1. Set Department (Always, if not manually provided)
        if (!tickData.department) {
            tickData.department = mapping.dept;
        }

        // 2. Set Priority (If user is restricted, or if priority is missing)
        if (!isPrivileged || !tickData.priority) {
            tickData.priority = mapping.prio;
        }

        // 2. Auto-Assign to Agent (Round-Robin / Random) if not manually assigned
        if (!tickData.assignedTo && tickData.department) {
            // Find agents in this department
            const agents = await User.find({
                role: 'agent',
                department: tickData.department,
                isActive: true
            });

            if (agents.length > 0) {
                // Random Assignment
                const randomIndex = Math.floor(Math.random() * agents.length);
                tickData.assignedTo = agents[randomIndex]._id;
            }
        }

        // RBAC Check for file uploads
        if (req.files && req.files.length > 0 && req.user.role !== 'user') {
            const error = new Error('Not authorized to upload files. Only Users can upload attachments.');
            error.statusCode = 403;
            throw error;
        }

        if (req.files && req.files.length > 0) {
            tickData.files = req.files;
        }

        const ticket = await ticketService.createTicket(tickData, req.user._id);
        res.status(201).json(new ApiResponse(201, ticket, 'Ticket created successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Get all tickets
// @route   GET /api/v1/tickets
// @access  Private
export const getAllTickets = async (req, res, next) => {
    try {
        const tickets = await ticketService.getAllTickets(req.query, req.user);
        res.status(200).json(new ApiResponse(200, tickets, 'Tickets retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Get single ticket
// @route   GET /api/v1/tickets/:id
// @access  Private
export const getTicket = async (req, res, next) => {
    try {
        const ticket = await ticketService.getTicketById(req.params.id, req.user);
        res.status(200).json(new ApiResponse(200, ticket, 'Ticket retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Update ticket
// @route   PUT /api/v1/tickets/:id
// @access  Private
export const updateTicket = async (req, res, next) => {
    try {
        // RBAC Check for file uploads
        if (req.files && req.files.length > 0 && req.user.role !== 'user') {
            const error = new Error('Not authorized to upload files. Only Users can upload attachments.');
            error.statusCode = 403;
            throw error;
        }

        const updateData = { ...req.body };
        if (req.files && req.files.length > 0) {
            updateData.files = req.files;
        }

        const ticket = await ticketService.updateTicket(req.params.id, updateData, req.user);
        res.status(200).json(new ApiResponse(200, ticket, 'Ticket updated successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Delete ticket
// @route   DELETE /api/v1/tickets/:id
// @access  Private (Admin only)
export const deleteTicket = async (req, res, next) => {
    try {
        await ticketService.deleteTicket(req.params.id, req.user);
        res.status(200).json(new ApiResponse(200, null, 'Ticket deleted successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Get ticket history
// @route   GET /api/v1/tickets/:id/history
// @access  Private
export const getTicketHistory = async (req, res, next) => {
    try {
        const history = await ticketService.getTicketLogs(req.params.id, req.user);
        res.status(200).json(new ApiResponse(200, history, 'Ticket history retrieved successfully'));
    } catch (error) {
        next(error);
    }
};
