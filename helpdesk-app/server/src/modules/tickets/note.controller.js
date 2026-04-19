import Note from './note.model.js';
import Ticket from './ticket.model.js';
import { ApiError } from '../../utils/apiResponse.js';

import TicketLog from './ticketLog.model.js';

// @desc    Get notes for a ticket
// @route   GET /api/tickets/:ticketId/notes
// @access  Private
export const getNotes = async (req, res, next) => {
    try {
        const ticket = await Ticket.findById(req.params.ticketId);

        if (!ticket) {
            throw new ApiError(404, 'Ticket not found');
        }

        // Access check (User can see own, Staff can see all allowed)
        if (req.user.role === 'user' && ticket.createdBy.toString() !== req.user.id) {
            throw new ApiError(401, 'User not authorized');
        }

        let query = { ticket: req.params.ticketId };

        // If regular user, hide internal notes
        if (req.user.role === 'user') {
            query.isInternal = false;
        }

        const notes = await Note.find(query).populate('user', 'name role');

        res.status(200).json({
            success: true,
            data: notes,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create ticket note
// @route   POST /api/tickets/:ticketId/notes
// @access  Private
export const addNote = async (req, res, next) => {
    try {
        const ticket = await Ticket.findById(req.params.ticketId);

        if (!ticket) {
            throw new ApiError(404, 'Ticket not found');
        }

        if (req.user.role === 'user' && ticket.createdBy.toString() !== req.user.id) {
            throw new ApiError(401, 'User not authorized');
        }

        const note = await Note.create({
            text: req.body.text,
            isStaff: req.user.role !== 'user', // Flag for checking if it's a staff note
            isInternal: req.body.isInternal && req.user.role !== 'user', // Only staff can make internal notes
            ticket: req.params.ticketId,
            user: req.user.id
        });

        // Log the note addition
        await TicketLog.create({
            ticket: req.params.ticketId,
            action: note.isInternal ? 'Internal Note Added' : 'Note Added',
            performedBy: req.user.id,
            newValue: { text: note.text, isInternal: note.isInternal }
        });

        // Populate user details for immediate frontend display
        await note.populate('user', 'name role');

        res.status(200).json({
            success: true,
            data: note,
        });
    } catch (error) {
        next(error);
    }
};
