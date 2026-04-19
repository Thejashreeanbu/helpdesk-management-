import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './modules/users/user.model.js';
import { env } from './config/env.js';

dotenv.config();

const users = [
    {
        name: 'Super Admin',
        email: 'superadmin@helpdesk.com',
        password: 'password123',
        role: 'super-admin',
        department: 'Global',
        isVerified: true,
        twoFactorEnabled: false
    },
    {
        name: 'Admin User',
        email: 'admin@helpdesk.com',
        password: 'password123',
        role: 'admin',
        department: 'IT',
        isVerified: true,
        twoFactorEnabled: false
    },
    {
        name: 'IT Manager',
        email: 'manager_it@helpdesk.com',
        password: 'password123',
        role: 'manager',
        department: 'IT',
        isVerified: true
    },
    {
        name: 'IT Agent',
        email: 'agent_it@helpdesk.com',
        password: 'password123',
        role: 'agent',
        department: 'IT',
        isVerified: true
    },
    {
        name: 'Regular User',
        email: 'user@helpdesk.com',
        password: 'password123',
        role: 'user',
        department: 'General',
        isVerified: true
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/helpdesk_db');
        console.log('MongoDB Connected...');

        // Clear existing users? Maybe optional. Let's strictly upsert or just create if not exists.
        // For development, clearing might be cleaner to ensure roles are correct.
        await User.deleteMany({ email: { $in: users.map(u => u.email) } });
        console.log('Cleared existing test users...');

        for (const user of users) {
            await User.create(user);
        }

        console.log('Database Seeded Successfully!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
