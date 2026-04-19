
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../modules/users/user.model.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const checkAgents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const agents = await User.find({ role: 'agent' });

        console.log('\n--- AGENT AUDIT ---');
        const byDept = {};

        agents.forEach(a => {
            if (!byDept[a.department]) byDept[a.department] = [];
            byDept[a.department].push(`${a.name} (${a.email})`);
        });

        Object.keys(byDept).forEach(dept => {
            console.log(`\nDEPARTMENT: ${dept || 'None'}`);
            byDept[dept].forEach(agent => console.log(` - ${agent}`));
        });

        console.log('\n-------------------');
        console.log('Mapping Values defined in Controller:');
        console.log('Billing Issue -> Finance');
        console.log('Technical Support -> IT');
        console.log('Access Issue -> IT');
        console.log('Feature Request -> IT');
        console.log('General Inquiry -> Support');

        if (agents.length === 0) {
            console.log('\nWARNING: No agents found in system! Auto-assignment will fail.');
        } else {
            // Check coverage
            ['Finance', 'IT', 'Support'].forEach(needed => {
                if (!byDept[needed] || byDept[needed].length === 0) {
                    console.log(`\nWARNING: No agents in '${needed}'. Tickets for this dept will remain UNASSIGNED.`);
                }
            });
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkAgents();
