import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

export const RootRedirect = () => {
    const { user, loading, role } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="min-h-screen bg-background-dark flex items-center justify-center text-white">Chargement...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user has seen onboarding
    // Note: user_metadata properties can be accessed directly or via a typed helper if available
    const hasSeenOnboarding = user.user_metadata?.has_seen_onboarding === true;

    // If user is admin, or has seen onboarding, go to reader
    if (role === 'admin' || hasSeenOnboarding) {
        return <Navigate to="/reader" replace />;
    } else {
        return <Navigate to="/onboarding" replace />;
    }
};
