
import EmployeeLeaveRequest from "./pages/employee/LeaveRequest"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ManagerLeaveRequest from "./pages/manager/LeaveRequest"
import ShiftRequestPage from "./pages/employee/ShiftRequestPage";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ManagerSidebar from './components/ManagerSidebar';
import ManagerHome from './pages/manager/ManagerHome';
import ManagerSchedule from './pages/manager/ManagerSchedule';
import EmployeeHome from './pages/employee/EmployeeHome';
import EmployeeSchedule from './pages/employee/EmployeeSchedule';
import './App.css'


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/employee/home" element={<EmployeeHome />} />
        <Route path="/employee/requests/shift" element={<ProtectedRoute><ShiftRequestPage /></ProtectedRoute>} />
        <Route path="/employee/requests/leave" element={<ProtectedRoute><EmployeeLeaveRequest /></ProtectedRoute>} />
        <Route path="/manager/requests/leave" element={<ProtectedRoute><ManagerLeaveRequest /></ProtectedRoute>} />
        {/* <EmployeeLeaveRequest /> */}
        <Route path="/manager/home" element={<ManagerHome />} />
        <Route path="/manager/schedule" element={<ManagerSchedule />} />
        <Route path="/employee/schedule" element={<EmployeeSchedule />} />
        <Route path="/employee/requests/*" element={<></>} />
        <Route path="/employee/settings" element={<></>} />
        <Route path="/manager/*" element={<></>} />
      </Routes>
    </Router>
  )
}

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// ;




