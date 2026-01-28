import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/TeamList.css';

const AddUser = () => {
  const navigate = useNavigate();

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    dept_id: '',
    role_id: '2'
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Department list state
  const [departments, setDepartments] = useState([]);

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:5000/departments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch departments");
        }

        const data = await response.json();
        setDepartments(data);
        
        // Set the first department as default if departments exist
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, dept_id: data[0].id.toString() }));
        }
      } catch (err) {
        console.error("Error fetching departments:", err);
        // Fallback to empty if API fails
        setDepartments([]);
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      // Validate form data
      if (!formData.name.trim() || !formData.email.trim() || !formData.mobile.trim()) {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
      }

      // Split name into first and last
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || ' ';

      // Build request payload (do NOT include password in frontend payload)
      const payload = {
        first_name: firstName,
        last_name: lastName,
        email: formData.email,
        mobile_number: formData.mobile,
        department_id: formData.dept_id,
        role_id: formData.role_id
      };

      // Send POST request to backend
      const response = await fetch("http://localhost:5000/auth/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add user");
      }

      const responseData = await response.json();
      
      console.log('User created successfully:', responseData.user);
      console.log('Email sent status:', responseData.emailSent);
      
      // Show success message with email status
      if (responseData.emailSent) {
        setSuccessMessage(`User "${firstName}" added successfully! A welcome email has been sent to ${formData.email}.`);
      } else {
        setSuccessMessage(`User "${firstName}" added successfully! Note: Email could not be sent. The password has been logged on the server console.`);
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        mobile: '',
        dept_id: '1',
        role_id: '2'
      });

      // Redirect to users page after 2 seconds with refresh flag
      setTimeout(() => {
        console.log('Navigating to users page with refresh flag');
        navigate('/manager/users', { state: { refresh: true } });
      }, 2000);

    } catch (err) {
      console.error("Error adding user:", err);
      setError(err.message || "Server connection failed. Is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/manager/users');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  return (
    <div className="add-user-page">
      <div className="add-user-container">
        <div className="form-card">
          <div className="form-header">
            <h1>Add New User</h1>
            <p>Fill in the details below to create a new user account</p>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="alert alert-success">
              ✓ {successMessage}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="alert alert-error">
              ✗ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Sonia Yeong"
                required
                disabled={loading}
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="email@kkh.com.sg"
                required
                disabled={loading}
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Mobile Number *</label>
              <input
                type="text"
                name="mobile"
                placeholder="8-digit mobile"
                required
                disabled={loading}
                value={formData.mobile}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Department *</label>
              <select
                name="dept_id"
                value={formData.dept_id}
                disabled={loading || departments.length === 0}
                onChange={handleInputChange}
              >
                <option value="">-- Select Department --</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Access Role *</label>
              <select
                name="role_id"
                value={formData.role_id}
                disabled={loading}
                onChange={handleInputChange}
              >
                <option value="2">Employee</option>
                <option value="1">Admin</option>
              </select>
            </div>

            <div className="form-footer">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Adding User...' : 'Add User'}
              </button>
            </div>
          </form>

          <div className="form-note">
            <p><strong>Note:</strong> A temporary password will be automatically generated and sent to the user's email. They must change it on first login.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
