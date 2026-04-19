import { Router } from 'express';
import * as ticketController from './ticket.controller.js';
import { protect, authorize } from '../../middlewares/auth.middleware.js';
import noteRouter from './note.routes.js';

import upload from '../../middlewares/upload.middleware.js';

const router = Router();

// Re-route into note router
router.use('/:ticketId/notes', noteRouter);

router.use(protect);

router
    .route('/')
    .get(ticketController.getAllTickets)
    .post(authorize('user', 'admin', 'super-admin'), upload.array('attachments', 5), ticketController.createTicket);

router
    .route('/:id')
    .get(ticketController.getTicket)
    .put(upload.array('attachments', 5), ticketController.updateTicket)
    .delete(authorize('admin'), ticketController.deleteTicket);

router.get('/:id/history', ticketController.getTicketHistory);

export default router;
