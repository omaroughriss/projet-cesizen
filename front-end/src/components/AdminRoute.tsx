import { Navigate, useLocation } from 'react-router-dom';

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (userRole !== 'administrateur') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute; 