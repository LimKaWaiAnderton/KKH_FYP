
import EmployeeLeaveRequest from "./pages/employee/LeaveRequest"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ManagerLeaveRequest from "./pages/manager/LeaveRequest"
import ShiftRequestPage from "./pages/employee/ShiftRequestPage";
import Home from "./pages/employee/Home";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/employee/home" element={<Home />} />
        <Route path="/employee/requests/shift" element={<ProtectedRoute><ShiftRequestPage /></ProtectedRoute>} />
        <Route path="/employee/requests/leave" element={<ProtectedRoute><EmployeeLeaveRequest /></ProtectedRoute>} />
        <Route path="/manager/requests/leave" element={<ProtectedRoute><ManagerLeaveRequest /></ProtectedRoute>} />
        {/* <EmployeeLeaveRequest /> */}
      </Routes>
    </Router>
  )
}


