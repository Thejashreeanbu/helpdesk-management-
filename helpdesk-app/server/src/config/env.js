import dotenv from 'dotenv';
dotenv.config();

export const env = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/helpdesk_db',
    JWT_SECRET: process.env.JWT_SECRET || 'secret_key_change_me',
    NODE_ENV: process.env.NODE_ENV || 'development',
};
