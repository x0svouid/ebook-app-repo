import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import AccueilReader from './pages/reader/AccueilReader'
import DetailManuel from './pages/reader/DetailManuel'
import SearchPage from './pages/reader/SearchPage'
import SettingsPage from './pages/reader/SettingsPage'
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'
import LessonReader from './pages/reader/LessonReader'
import ScannerPage from './pages/admin/ScannerPage'
import UsersPage from './pages/admin/UsersPage'
import EditUserPage from './pages/admin/EditUserPage'
import AddUserPage from './pages/admin/AddUserPage';
import ProfilePage from './pages/profile/ProfilePage';
import LecturesPage from './pages/reader/LecturesPage';
import EditVolumePage from './pages/admin/EditVolumePage';
import CreateVolumePage from './pages/admin/CreateVolumePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext'
import { RootRedirect } from './RootRedirect'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="min-h-screen bg-background-dark flex items-center justify-center text-white">Chargement...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<SignIn />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/" element={<RootRedirect />} />
                <Route path="/onboarding" element={<Onboarding />} />

                {/* Protected Routes */}
                <Route path="/reader" element={
                    <ProtectedRoute>
                        <AccueilReader />
                    </ProtectedRoute>
                } />
                <Route path="/reader/current" element={
                    <ProtectedRoute>
                        <AccueilReader />
                    </ProtectedRoute>
                } />
                <Route path="/reader/lectures" element={
                    <ProtectedRoute>
                        <LecturesPage />
                    </ProtectedRoute>
                } />
                <Route path="/reader/volume/:id" element={
                    <ProtectedRoute>
                        <DetailManuel />
                    </ProtectedRoute>
                } />
                <Route path="/reader/lesson/:id" element={
                    <ProtectedRoute>
                        <LessonReader />
                    </ProtectedRoute>
                } />
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/admin/scan" element={
                    <ProtectedRoute>
                        <ScannerPage />
                    </ProtectedRoute>
                } />
                <Route path="/search" element={
                    <ProtectedRoute>
                        <SearchPage />
                    </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                    <ProtectedRoute>
                        <UsersPage />
                    </ProtectedRoute>
                } />
                <Route path="/admin/users/:id" element={
                    <ProtectedRoute>
                        <EditUserPage />
                    </ProtectedRoute>
                } />
                <Route path="/admin/users/new" element={
                    <ProtectedRoute>
                        <AddUserPage />
                    </ProtectedRoute>
                } />
                <Route path="/settings" element={
                    <ProtectedRoute>
                        <SettingsPage />
                    </ProtectedRoute>
                } />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                } />
                <Route path="/admin/volumes/edit/:id" element={
                    <ProtectedRoute>
                        <EditVolumePage />
                    </ProtectedRoute>
                } />
                <Route path="/admin/volumes/new" element={
                    <ProtectedRoute>
                        <CreateVolumePage />
                    </ProtectedRoute>
                } />
            </Routes>
        </AuthProvider>
    )
}

export default App
