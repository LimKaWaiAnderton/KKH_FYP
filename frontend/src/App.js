import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import ShiftRequestPage from "./pages/employee/ShiftRequestPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/shift-request" element={<ShiftRequestPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
