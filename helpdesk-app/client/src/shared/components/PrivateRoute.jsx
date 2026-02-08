import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
    const { user } = useSelector((state) => state.auth);

    // If user is not logged in, redirect to login
    // In a real app, we might also check for a loading state to avoid premature redirects
    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
