import EmployeeSideBar from "../components/EmployeeSideBar/EmployeeSideBar";
import "../styles/EmployeeLayout/EmployeeLayout.css";

export default function MainLayout({ children }) {
  return (
    <div className="employee-layout">
      <EmployeeSideBar />
      <main className="employee-content">
        {children}
      </main>
    </div>
  );
}
