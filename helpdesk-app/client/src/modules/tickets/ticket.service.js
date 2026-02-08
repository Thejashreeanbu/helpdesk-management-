import api from '../../services/api';

const createTicket = async (ticketData) => {
    // If ticketData contains files, we need FormData
    // Assuming ticketData has a 'files' property which is an array of File objects, 
    // OR we convert everything to FormData if we detect it.
    // Let's assume the caller passes a plain object, and if it has 'attachments' (FileList or array), we handle it.

    let config = {};
    let data = ticketData;

    if (ticketData.attachments && ticketData.attachments.length > 0) {
        const formData = new FormData();
        // Append text fields
        Object.keys(ticketData).forEach(key => {
            if (key === 'attachments') {
                // Append files
                Array.from(ticketData.attachments).forEach(file => {
                    formData.append('attachments', file);
                });
            } else {
                formData.append(key, ticketData[key]);
            }
        });
        data = formData;
        config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };
    }

    const response = await api.post('/tickets', data, config);
    return response.data.data;
};

const getTickets = async () => {
    const response = await api.get('/tickets');
    return response.data.data;
};

const getTicket = async (ticketId) => {
    const response = await api.get(`/tickets/${ticketId}`);
    return response.data.data;
};

const updateTicket = async (ticketId, ticketData) => {
    let config = {};
    let data = ticketData;

    if (ticketData.attachments && ticketData.attachments.length > 0) {
        const formData = new FormData();
        Object.keys(ticketData).forEach(key => {
            if (key === 'attachments') {
                Array.from(ticketData.attachments).forEach(file => {
                    formData.append('attachments', file);
                });
            } else {
                formData.append(key, ticketData[key]);
            }
        });
        data = formData;
        config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };
    }

    const response = await api.put(`/tickets/${ticketId}`, data, config);
    return response.data.data;
};

const deleteTicket = async (ticketId) => {
    const response = await api.delete(`/tickets/${ticketId}`);
    return response.data.data;
};

// Update ticket status (e.g., Close)
// Close ticket
const closeTicket = async (ticketId) => {
    const response = await api.put(`/tickets/${ticketId}`, { status: 'Closed' });
    return response.data.data;
};

// Assign ticket to a user
const assignTicket = async (ticketId, userId) => {
    const response = await api.put(`/tickets/${ticketId}`, { assignedTo: userId });
    return response.data.data;
};

// Get ticket history
const getTicketHistory = async (ticketId) => {
    const response = await api.get(`/tickets/${ticketId}/history`);
    return response.data.data;
};

const ticketService = {
    createTicket,
    getTickets,
    getTicket,
    updateTicket,
    deleteTicket,
    closeTicket,
    assignTicket,
    getTicketHistory,
};

export default ticketService;
