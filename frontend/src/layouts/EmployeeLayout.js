import EmployeeSidebar from "../components/EmployeeSideBar/EmployeeSideBar";
import "../styles/EmployeeLayout/EmployeeLayout.css";

export default function EmployeeLayout({ children }) {
  return (
    <div className="employee-layout">
      <EmployeeSidebar />
      <main className="employee-content">
        {children}
      </main>
    </div>
  );
}
