import api from '../../services/api';

// Get ticket notes
const getNotes = async (ticketId) => {
    const response = await api.get(`/tickets/${ticketId}/notes`);
    return response.data.data;
};

// Create ticket note
const createNote = async (ticketId, noteText) => {
    const response = await api.post(`/tickets/${ticketId}/notes`, {
        text: noteText,
    });
    return response.data.data;
};

const noteService = {
    getNotes,
    createNote,
};

export default noteService;
