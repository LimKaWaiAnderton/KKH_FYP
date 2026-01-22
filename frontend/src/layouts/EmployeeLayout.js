import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import EmployeeSidebar from "../components/EmployeeSideBar/EmployeeSideBar";
import "../styles/EmployeeLayout/EmployeeLayout.css";

export default function EmployeeLayout({ children }) {
  const [expanded, setExpanded] = useState(false);
  const collapseTimeoutRef = useRef(null);
  const location = useLocation();
  const preventCollapseRef = useRef(false);

  // Prevent collapse when route changes
  useEffect(() => {
    preventCollapseRef.current = true;
    const timer = setTimeout(() => {
      preventCollapseRef.current = false;
    }, 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleMouseEnter = () => {
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current);
      collapseTimeoutRef.current = null;
    }
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    if (preventCollapseRef.current) return;
    collapseTimeoutRef.current = setTimeout(() => {
      setExpanded(false);
    }, 200);
  };

  return (
    <div className="employee-layout">
      <EmployeeSidebar 
        expanded={expanded}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <main className="employee-content">
        {children}
      </main>
    </div>
  );
}
