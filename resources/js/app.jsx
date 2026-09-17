import '../css/app.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddStudentPage from './pages/AddStudentPage';
import AddSubjectPage from './pages/AddSubjectPage';
import Login from './pages/Login';
import StudentProfile from './pages/StudentProfile';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import AddUserPage from './pages/AddUserPage';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ToastProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />

                        {/* Everything below gets the navbar + sidebar */}
                        <Route element={<Layout />}>
                            <Route path="/" element={
                                <ProtectedRoute><Home /></ProtectedRoute>
                            } />

                            <Route path="/students/:id" element={
                                <ProtectedRoute><StudentProfile /></ProtectedRoute>
                            } />

                            <Route path="/add-student" element={
                                <ProtectedRoute roles={['admin','teacher']}><AddStudentPage /></ProtectedRoute>
                            } />

                            <Route path="/add-subject" element={
                                <ProtectedRoute roles={['admin','teacher']}><AddSubjectPage /></ProtectedRoute>
                            } />

                            <Route path="/add-user" element={
                                <ProtectedRoute roles={['admin']}><AddUserPage /></ProtectedRoute>
                            } />
                            <Route path="/profile" element={
                                <ProtectedRoute><Profile/></ProtectedRoute>
                            } />
                        </Route>

                        <Route path="/change-password" element={
                            <ProtectedRoute><ChangePassword /></ProtectedRoute>
                        } />
                    </Routes>
                </ToastProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);