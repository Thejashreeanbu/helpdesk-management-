import express from 'express';
import { getNotes, addNote } from './note.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(protect, getNotes)
    .post(protect, addNote);

export default router;
