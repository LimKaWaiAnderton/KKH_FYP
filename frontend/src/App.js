
import EmployeeLeaveRequest from "./pages/employee/LeaveRequest"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ManagerLeaveRequest from "./pages/manager/LeaveRequest"
import ShiftRequestPage from "./pages/employee/ShiftRequestPage";
import TeamList from "./pages/manager/TeamList";
import AddUser from "./pages/manager/AddUser";
import Home from "./pages/employee/Home";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/employee/home" element={<ProtectedRoute><MainLayout><Home /></MainLayout></ProtectedRoute>} />
        <Route path="/employee/requests/shift" element={<ProtectedRoute><MainLayout><ShiftRequestPage /></MainLayout></ProtectedRoute>} />
        <Route path="/employee/requests/leave" element={<ProtectedRoute><MainLayout><EmployeeLeaveRequest /></MainLayout></ProtectedRoute>} />
        <Route path="/manager/requests/leave" element={<ProtectedRoute><MainLayout><ManagerLeaveRequest /></MainLayout></ProtectedRoute>} />
        <Route path="/manager/team-list" element={<ProtectedRoute><MainLayout><TeamList /></MainLayout></ProtectedRoute>} />
        <Route path="/manager/add-user" element={<ProtectedRoute><MainLayout><AddUser /></MainLayout></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}
