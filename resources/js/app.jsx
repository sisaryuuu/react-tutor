import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddStudentPage from './pages/AddStudentPage';
import AddSubjectPage from './pages/AddSubjectPage';
import Login from './pages/Login';
import StudentProfile from './pages/StudentProfile';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route path="/" element={
                        <ProtectedRoute><Home /></ProtectedRoute>
                    } />

                    <Route path="/students/:id" element={
                        <ProtectedRoute><StudentProfile /></ProtectedRoute>
                    } />

                    <Route path="/add-student" element={
                        <ProtectedRoute roles={['admin']}><AddStudentPage /></ProtectedRoute>
                    } />

                    <Route path="/add-subject" element={
                        <ProtectedRoute roles={['admin']}><AddSubjectPage /></ProtectedRoute>
                    } />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);