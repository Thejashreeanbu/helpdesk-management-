import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleRoute = ({ allowedRoles }) => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />; // Redirect to dashboard if unauthorized
        // Or return <Navigate to="/unauthorized" /> if you have one
    }

    return <Outlet />;
};

export default RoleRoute;
