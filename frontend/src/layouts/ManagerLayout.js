import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ManagerSidebar from "../components/manager/Home/ManagerSidebar";
import "../styles/ManagerLayout.css";

export default function ManagerLayout({ children }) {
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
    <div className="manager-layout">
      <ManagerSidebar 
        expanded={expanded}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <main className="manager-content">
        {children}
      </main>
    </div>
  );
}
