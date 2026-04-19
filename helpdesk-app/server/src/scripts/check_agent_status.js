
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

        console.log('\n--- AGENT STATUS AUDIT ---');
        agents.forEach(a => {
            console.log(`Agent: ${a.name} (${a.email})`);
            console.log(` - Role: ${a.role}`);
            console.log(` - Dept: ${a.department}`);
            console.log(` - IsActive: ${a.isActive}`); // check boolean
            console.log(` - ID: ${a._id}`);
        });

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkAgents();
