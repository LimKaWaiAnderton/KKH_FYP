import { useEffect, useState } from "react";
import { supabase } from "./supabase";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      const { data, error } = await supabase
        .from("users")
        .select("*");

      if (error) {
        console.error("❌ Error loading users:", error);
      } else {
        console.log("✅ Users loaded:", data);
        setUsers(data);
      }
    }

    loadUsers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Users Table</h1>

      {users.length === 0 && <p>No users found...</p>}

      {users.map((u) => (
        <div key={u.id} style={{ marginBottom: "12px" }}>
          <p><strong>Name:</strong> {u.name}</p>
          <p><strong>Email:</strong> {u.email}</p>
          <p><strong>Role:</strong> {u.role}</p>
          <p><strong>Department ID:</strong> {u.department_id}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;
