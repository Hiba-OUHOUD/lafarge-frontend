import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ToastContainer from './components/ToastContainer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTrainings from './pages/admin/AdminTrainings';
import AdminStats from './pages/admin/AdminStats';
import EmployeeLayout from './components/EmployeeLayout';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import MyLearnings from './pages/employee/MyLearnings';
import Notifications from './pages/employee/Notifications';
import QuizPage from './pages/employee/QuizPage';
import LearningPage from './pages/employee/LearningPage';
import TrainerLayout from './components/TrainerLayout';
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import ManageChapters from './pages/trainer/ManageChapters';
import VerifyCertificate from './pages/VerifyCertificate';
import RegisterPage from './pages/RegisterPage';


const PrivateRoute = ({ children, allowedRole }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="text-center p-8">Chargement...</div>;
    if (!user) return <Navigate to="/" />;
    if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;
    return children;
};

function App() {
    return (
        <AuthProvider>
            <NotificationProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/verify-certificate/:enrollmentId" element={<VerifyCertificate />} />

                        {/* Admin */}
                        <Route path="/admin" element={
                            <PrivateRoute allowedRole="ADMIN"><AdminLayout /></PrivateRoute>
                        }>
                            <Route index element={<AdminDashboard />} />
                            <Route path="users" element={<AdminUsers />} />
                            <Route path="trainings" element={<AdminTrainings />} />
                            <Route path="stats" element={<AdminStats />} />
                        </Route>

                        {/* Employé */}
                        <Route path="/employee" element={
                            <PrivateRoute allowedRole="EMPLOYEE"><EmployeeLayout /></PrivateRoute>
                        }>
                            <Route index element={<EmployeeDashboard />} />
                            <Route path="my-learnings" element={<MyLearnings />} />
                            <Route path="notifications" element={<Notifications />} />
                            <Route path="learning/:enrollmentId" element={<LearningPage />} />
                            <Route path="quiz/:enrollmentId" element={<QuizPage />} />
                        </Route>

                        {/* Formateur */}
                        <Route path="/trainer" element={
                            <PrivateRoute allowedRole="TRAINER"><TrainerLayout /></PrivateRoute>
                        }>
                            <Route index element={<TrainerDashboard />} />
                            <Route path="chapters/:trainingId" element={<ManageChapters />} />
                        </Route>
                    </Routes>
                    
                    {/* ⚠️ ToastContainer DOIT être à l'intérieur du Router */}
                    <ToastContainer />
                </Router>
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;