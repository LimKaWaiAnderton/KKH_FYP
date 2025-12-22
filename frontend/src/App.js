import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ShiftRequestPage from "./pages/employee/ShiftRequestPage";
import Home from "./pages/employee/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/employee/home" element={<Home />} />
        <Route
          path="/employee/requests/shift"
          element={<ShiftRequestPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
