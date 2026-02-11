import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { jwtDecode } from "jwt-decode";
import { useEffect } from 'react';

export default function ProtectedRoute() {
    const { isAuthenticated, token, logout } = useAuthStore();

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode<{ exp: number }>(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp && decodedToken.exp < currentTime) {
                    logout();
                }
            } catch (error) {
                // Invalid token
                logout();
            }
        }
    }, [token, logout]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
