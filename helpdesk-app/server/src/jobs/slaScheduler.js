import cron from 'node-cron';
import { checkSlaStatus } from '../modules/tickets/ticket.service.js';

export const startSlaScheduler = () => {
    // Schedule task to run every minute
    cron.schedule('* * * * *', async () => {
        try {
            await checkSlaStatus();
        } catch (error) {
            console.error('Error running SLA Check:', error);
        }
    });

    console.log('SLA Scheduler started: Checking for breaches every minute.');
};
