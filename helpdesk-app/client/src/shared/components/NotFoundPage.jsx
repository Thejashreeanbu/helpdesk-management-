import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Page Not Found</h2>
            <Link to="/" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition">
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFoundPage;
