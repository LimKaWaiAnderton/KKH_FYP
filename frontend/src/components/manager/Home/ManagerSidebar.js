import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../styles/ManagerSidebar.css";


import {
    HiOutlineHome,
    HiOutlineCalendar,
    HiOutlineClipboardList,
    HiOutlineCog,
    HiOutlineUser,
} from "react-icons/hi";
import { HiOutlineArrowRightStartOnRectangle } from "react-icons/hi2";

export default function ManagerSidebar({ expanded, onMouseEnter, onMouseLeave }) {
    const [openRequests, setOpenRequests] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;

    // Simple "active key" based on current URL
    let activeKey = "";

    if (pathname === "/manager/home") {
        activeKey = "home";
    } else if (pathname === "/manager/schedule") {
        activeKey = "schedule";
    } else if (pathname === "/manager/users") {
        activeKey = "users"; // Manager-only: Users management
    } else if (pathname === "/manager/settings") {
        activeKey = "settings";
    } else if (pathname.startsWith("/manager/requests/leave")) {
        activeKey = "leave";
    } else if (pathname.startsWith("/manager/requests/")) {
        activeKey = "requests";
    }

    // Requests parent should be active whenever any requests page is active
    const isRequestsParentActive =
        activeKey === "requests" ||
        activeKey === "leave";

    // Close submenu when navigating away from requests
    useEffect(() => {
        if (!isRequestsParentActive) {
            setOpenRequests(false);
        }
    }, [isRequestsParentActive]);

    // Show submenu when sidebar is expanded AND
    // either user opened it OR we are inside a requests route
    const showRequestsSubmenu =
        expanded && (openRequests || isRequestsParentActive);

    function go(path) {
        navigate(path);
    }

    return (
        <div
            className={`navbar ${expanded ? "expanded" : ""}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {/* ---------- TOP SECTION ---------- */}
            <div className="nav-top">
                {/* HOME */}
                <div
                    className={`nav-item ${activeKey === "home" ? "active" : ""}`}
                >
                    <div className="nav-pill" onClick={() => go("/manager/home")}>
                        <HiOutlineHome className="icon" />
                        {expanded && <span className="label">Home</span>}
                    </div>
                </div>

                {/* SCHEDULE */}
                <div
                    className={`nav-item ${activeKey === "schedule" ? "active" : ""}`}
                >
                    <div className="nav-pill" onClick={() => go("/manager/schedule")}>
                        <HiOutlineCalendar className="icon" />
                        {expanded && <span className="label">Schedule</span>}
                    </div>
                </div>

                {/* REQUESTS + SUBMENU */}
                <div className="nav-group">
                    {/* Requests parent (no direct route) */}
                    <div
                        className={`nav-item ${isRequestsParentActive ? "active" : ""}`}
                    >
                        <div
                            className="nav-pill"
                            onClick={() => setOpenRequests(prev => !prev)}
                        >
                            <HiOutlineClipboardList className="icon" />
                            {expanded && <span className="label">Requests</span>}
                        </div>
                    </div>

                    {/* Submenu: Leave only */}
                    {showRequestsSubmenu && (
                        <div className="nav-submenu">
                            {/* Leave */}
                            <div
                                className={`nav-item nav-sub ${activeKey === "leave" ? "active-sub" : ""
                                    }`}
                            >
                                <div
                                    className="nav-pill"
                                    onClick={() => go("/manager/requests/leave")}
                                >
                                    <span className="icon-placeholder" />
                                    {expanded && <span className="sub-label">Leave</span>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* USERS - Manager only */}
                <div
                    className={`nav-item ${activeKey === "users" ? "active" : ""}`}
                >
                    <div className="nav-pill" onClick={() => go("/manager/users")}>
                        <HiOutlineUser className="icon" />
                        {expanded && <span className="label">Users</span>}
                    </div>
                </div>
            </div>

            {/* ---------- BOTTOM SECTION ---------- */}
            <div className="nav-bottom">
                {/* SETTINGS */}
                <div
                    className={`nav-item ${activeKey === "settings" ? "active" : ""}`}
                >
                    <div className="nav-pill" onClick={() => go("/manager/settings")}>
                        <HiOutlineCog className="icon" />
                        {expanded && <span className="label">Settings</span>}
                    </div>
                </div>

                {/* LOGOUT */}
                <div className="nav-item">
                    <div
                        className="nav-pill"
                        onClick={() => {
                            // add real logout logic later
                        }}
                    >
                        <HiOutlineArrowRightStartOnRectangle className="icon" />
                        {expanded && <span className="label">Logout</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}