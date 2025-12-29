
import EmployeeLeaveRequest from "./pages/employee/LeaveRequest"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ManagerLeaveRequest from "./pages/manager/LeaveRequest"
import ShiftRequestPage from "./pages/employee/ShiftRequestPage";
import Home from "./pages/employee/Home";

export default function App() {
    return( 
      <Router>
        <Routes>
          <Route path="/employee/home" element={<Home />} />
          <Route path="/employee/requests/shift" element={<ShiftRequestPage />} />
          <Route path="/employee/requests/leave" element={<EmployeeLeaveRequest />} />
          <Route path="/manager/requests/leave" element={<ManagerLeaveRequest />} />
                      {/* <EmployeeLeaveRequest /> */}
        </Routes>
      </Router>
    )
}


