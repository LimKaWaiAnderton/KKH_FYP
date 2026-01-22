import React, { useState } from 'react';
import '../styles/TeamList.css'; 

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
  // State must be defined at the top level of the component
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    dept_id: '1', // Default to first department
    role_id: '2'  // Default to Employee
  });

  // Check visibility AFTER hooks are defined
  if (!isOpen) return null;

  const generatePassword = () => {
    // Generates an 8-character random string
    return Math.random().toString(36).slice(-8);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = generatePassword();
    
    // 1. Split name into first and last for the database
    const nameParts = formData.name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || ' ';

    // 2. Build the final payload with correct database keys
    const payload = { 
      first_name: firstName, 
      last_name: lastName,
      email: formData.email,
      mobile_number: formData.mobile, // Matches your DB column
      department_id: formData.dept_id, // Matches DB column
      role_id: formData.role_id,       // Matches DB column
      password: password               // Hashed by backend controller
    };

    try {
      // 3. Use the correct endpoint from your auth.route.js
      const response = await fetch("http://localhost:5000/auth/add-user", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(`User added successfully!\nTemporary Password: ${password}\nPlease save this password.`);
        onUserAdded(); // Triggers re-fetch in TeamList.js
        onClose();     // Closes the modal
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to add user");
      }
    } catch (err) {
      console.error("Error adding user:", err);
      alert("Server connection failed. Is your backend running on port 5000?");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New User</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. Sonia Yeong" 
              required 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="email@kkh.com.sg" 
              required 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Mobile Number</label>
            <input 
              type="text" 
              placeholder="8-digit mobile" 
              required 
              onChange={(e) => setFormData({...formData, mobile: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <select value={formData.dept_id} onChange={(e) => setFormData({...formData, dept_id: e.target.value})}>
              <option value="1">Nursing</option>
              <option value="2">Pharmacy</option>
              <option value="3">Administration</option>
            </select>
          </div>
          <div className="form-group">
            <label>Access Role</label>
            <select value={formData.role_id} onChange={(e) => setFormData({...formData, role_id: e.target.value})}>
              <option value="2">Employee</option>
              <option value="1">Admin</option>
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Add User</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;