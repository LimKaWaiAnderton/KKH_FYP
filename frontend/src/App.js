import { useState, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import EmployeeLeaveRequest from "./pages/employee/LeaveRequest";
import ManagerLeaveRequest from "./pages/manager/LeaveRequest";
import ShiftRequestPage from "./pages/employee/ShiftRequestPage";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ManagerHome from './pages/manager/ManagerHome';
import ManagerSchedule from './pages/manager/ManagerSchedule';
import EmployeeHome from './pages/employee/EmployeeHome';
import EmployeeSchedule from './pages/employee/EmployeeSchedule';
import EmployeeSidebar from './components/EmployeeSideBar/EmployeeSideBar';
import ManagerSidebar from './components/manager/Home/ManagerSidebar';
import './App.css';
import TeamList from "./pages/manager/TeamList";
import AddUser from "./pages/manager/AddUser";


function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
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
      {!isLoginPage && isEmployeePage && (
        <EmployeeSidebar
          expanded={expanded}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
      {!isLoginPage && isManagerPage && (
        <ManagerSidebar
          expanded={expanded}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
      <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', background: '#f5f5f5' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/employee/home" element={<EmployeeHome />} />
          <Route path="/employee/requests/shift" element={<ProtectedRoute><ShiftRequestPage /></ProtectedRoute>} />
          <Route path="/employee/requests/leave" element={<ProtectedRoute><EmployeeLeaveRequest /></ProtectedRoute>} />
          <Route path="/employee/schedule" element={<EmployeeSchedule />} />
          <Route path="/manager/requests/leave" element={<ProtectedRoute><ManagerLeaveRequest /></ProtectedRoute>} />
          <Route path="/manager/home" element={<ManagerHome />} />
          <Route path="/manager/schedule" element={<ManagerSchedule />} />
          <Route path="/manager/users" element={<ProtectedRoute><TeamList /></ProtectedRoute>} />
          <Route path="/manager/add-user" element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
          <Route path="/employee/requests/*" element={<></>} />
          <Route path="/employee/settings" element={<></>} />
          <Route path="/manager/*" element={<></>} />
          <Route path="/manager/team-list" element={<ProtectedRoute><TeamList /></ProtectedRoute>} />
          <Route path="/manager/add-user" element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
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


