
const API_URL = 'http://localhost:5000/api/v1';

async function testTicketCreation() {
    try {
        console.log('Logging in...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'user@helpdesk.com',
                password: 'password123'
            })
        });

        if (!loginRes.ok) {
            const err = await loginRes.text();
            throw new Error(`Login failed: ${loginRes.status} ${err}`);
        }

        const loginData = await loginRes.json();
        const token = loginData.data.token;
        console.log('Login successful. Token:', token ? 'Recieved' : 'Missing');

        console.log('Creating ticket...');
        const ticketData = {
            subject: 'Test Ticket',
            description: 'This is a test ticket description.',
            priority: 'Medium',
            type: 'Incident'
        };

        const ticketRes = await fetch(`${API_URL}/tickets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(ticketData)
        });

        if (!ticketRes.ok) {
            const err = await ticketRes.text();
            throw new Error(`Ticket creation failed: ${ticketRes.status} ${err}`);
        }

        const mticket = await ticketRes.json();
        console.log('Ticket created successfully:', mticket);

    } catch (error) {
        console.error('Error during test:', error.message);
    }
}

testTicketCreation();
