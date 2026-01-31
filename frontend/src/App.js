import { useState, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import EmployeeLeaveRequest from "./pages/employee/LeaveRequest";
import ManagerLeaveRequest from "./pages/manager/LeaveRequest";
import ShiftRequestPage from "./pages/employee/ShiftRequestPage";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import ManagerHome from './pages/manager/ManagerHome';
import ManagerSchedule from './pages/manager/ManagerSchedule';
import EmployeeHome from './pages/employee/EmployeeHome';
import EmployeeSchedule from './pages/employee/EmployeeSchedule';
import EmployeeSidebar from './components/EmployeeSideBar/EmployeeSideBar';
import ManagerSidebar from './components/manager/Home/ManagerSidebar';
import Settings from './components/Settings';
import './App.css';
import TeamList from "./pages/manager/TeamList";
import AddUser from "./pages/manager/AddUser";
import EditUser from "./pages/manager/EditUser";
import ViewUser from './pages/manager/ViewUser';


function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/' || location.pathname === '/login';
  const isForgotPasswordPage = location.pathname === '/forgot-password';
  const isResetPasswordPage = location.pathname === '/reset-password';
  const isAuthPage = isLoginPage || isForgotPasswordPage || isResetPasswordPage;
  const isEmployeePage = location.pathname.startsWith('/employee');
  const isManagerPage = location.pathname.startsWith('/manager');

  const [expanded, setExpanded] = useState(false);
  const collapseTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current);
      collapseTimeoutRef.current = null;
    }
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    collapseTimeoutRef.current = setTimeout(() => {
      setExpanded(false);
    }, 200);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {!isAuthPage && isEmployeePage && (
        <EmployeeSidebar
          expanded={expanded}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
      {!isAuthPage && isManagerPage && (
        <ManagerSidebar
          expanded={expanded}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
      <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', background: '#f5f5f5' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Employee Routes - Protected */}
          <Route path="/employee/home" element={<ProtectedRoute requiredRole="employee"><EmployeeHome /></ProtectedRoute>} />
          <Route path="/employee/requests/shift" element={<ProtectedRoute requiredRole="employee"><ShiftRequestPage /></ProtectedRoute>} />
          <Route path="/employee/requests/leave" element={<ProtectedRoute requiredRole="employee"><EmployeeLeaveRequest /></ProtectedRoute>} />
          <Route path="/employee/schedule" element={<ProtectedRoute requiredRole="employee"><EmployeeSchedule /></ProtectedRoute>} />
          <Route path="/employee/settings" element={<ProtectedRoute requiredRole="employee"><Settings /></ProtectedRoute>} />
          <Route path="/employee/requests/*" element={<></>} />
          
          {/* Manager Routes - Protected */}
          <Route path="/manager/home" element={<ProtectedRoute requiredRole="admin"><ManagerHome /></ProtectedRoute>} />
          <Route path="/manager/requests/leave" element={<ProtectedRoute requiredRole="admin"><ManagerLeaveRequest /></ProtectedRoute>} />
          <Route path="/manager/schedule" element={<ProtectedRoute requiredRole="admin"><ManagerSchedule /></ProtectedRoute>} />
          <Route path="/manager/users" element={<ProtectedRoute requiredRole="admin"><TeamList /></ProtectedRoute>} />
          <Route path="/manager/team-list" element={<ProtectedRoute requiredRole="admin"><TeamList /></ProtectedRoute>} />
          <Route path="/manager/add-user" element={<ProtectedRoute requiredRole="admin"><AddUser /></ProtectedRoute>} />
          <Route path="/manager/view-user/:userId" element={<ProtectedRoute requiredRole="admin"><ViewUser /></ProtectedRoute>} />
          <Route path="/manager/edit-user/:userId" element={<ProtectedRoute requiredRole="admin"><EditUser /></ProtectedRoute>} />
          <Route path="/manager/settings" element={<ProtectedRoute requiredRole="admin"><Settings /></ProtectedRoute>} />
          <Route path="/manager/*" element={<></>} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '8px',
            fontSize: '14px',
          },
          success: {
            style: {
              background: 'var(--status-approved-bg)',
              color: 'var(--status-approved)',
              border: '1px solid var(--status-approved)',
            },
          },
          error: {
            style: {
              background: '#fdecea',
              color: '#d32f2f',
              border: '1px solid #f44336',
            },
          },
        }}
      />
      <AppContent />
    </Router>
  );
}


