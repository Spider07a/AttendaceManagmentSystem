import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Login from './pages/Login/Login';
import AppLayout from './components/layout/AppLayout';
import AuthGuard from './components/AuthGuard/AuthGuard';

import AdminDashboard from './pages/Admin/AdminDashboard';
import HODDashboard from './pages/Dashboards/HODDashboard';
import FacultyDashboard from './pages/Dashboards/FacultyDashboard';
import StudentDashboard from './pages/Student/StudentDashboard';
import NotFound from './pages/NotFound/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin Routes */}
          <Route element={<AuthGuard allowedRoles={['admin']} />}>
            <Route element={<AppLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/add-student" element={<Navigate to="/admin" />} />
            </Route>
          </Route>

          {/* HOD Routes */}
          <Route element={<AuthGuard allowedRoles={['hod']} />}>
            <Route element={<AppLayout />}>
              <Route path="/hod" element={<HODDashboard />} />
            </Route>
          </Route>

          {/* Faculty Routes */}
          <Route element={<AuthGuard allowedRoles={['faculty']} />}>
            <Route element={<AppLayout />}>
              <Route path="/faculty" element={<FacultyDashboard />} />
            </Route>
          </Route>

          {/* Student Routes */}
          <Route element={<AuthGuard allowedRoles={['student']} />}>
            <Route element={<AppLayout />}>
              <Route path="/student" element={<StudentDashboard />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
