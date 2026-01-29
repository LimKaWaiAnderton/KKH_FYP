import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authFetch } from '../../utils/authFetch';
import '../../styles/TeamList.css';

const EditUser = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  // Form data state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile_number: '',
    department_id: '',
    role_id: ''
  });

  // UI states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  
  // Department list state
  const [departments, setDepartments] = useState([]);

  // Fetch current logged-in user info to check if admin
  const fetchCurrentUser = async () => {
    try {
      const res = await authFetch('http://localhost:5000/auth/me');
      if (!res.ok) throw new Error("Failed to fetch current user");
      const data = await res.json();
      setCurrentUser(data);
      
      // Check if user is admin
      if (data.role_id !== 1 && data.role_id !== '1') {
        setError('You do not have permission to edit user information.');
        setTimeout(() => navigate('/manager/team-list'), 2000);
      }
    } catch (err) {
      console.error("Error fetching current user:", err);
      setError('Failed to verify permissions.');
    }
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const res = await authFetch(`http://localhost:5000/auth/users`);
      if (!res.ok) throw new Error("Failed to fetch users");
      
      const users = await res.json();
      const user = users.find(u => u.id === userId || u.id === parseInt(userId));
      
      if (!user) {
        setError('User not found.');
        setTimeout(() => navigate('/manager/team-list'), 2000);
        return;
      }

      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        mobile_number: user.mobile_number || '',
        department_id: user.department_id?.toString() || '',
        role_id: user.role_id?.toString() || '2'
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError('Failed to load user data.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await authFetch("http://localhost:5000/departments");
      if (!response.ok) throw new Error("Failed to fetch departments");
      const data = await response.json();
      setDepartments(data);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setDepartments([]);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchDepartments();
    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Show confirmation popup
    const confirmed = window.confirm(
      `Are you sure you want to update the information for ${formData.first_name} ${formData.last_name}?`
    );

    if (!confirmed) {
      return;
    }

    setError('');
    setSaving(true);

    try {
      // Validate form data
      if (!formData.first_name.trim() || !formData.email.trim()) {
        setError('Please fill in all required fields.');
        setSaving(false);
        return;
      }

      // Build request payload
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        mobile_number: formData.mobile_number,
        department_id: formData.department_id,
        role_id: formData.role_id
      };

      // Send PATCH request to backend
      const response = await authFetch(`http://localhost:5000/auth/update-user/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      // Show success message and redirect
      alert('User information updated successfully!');
      navigate('/manager/team-list', { state: { refresh: true } });
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.message || 'Failed to update user. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/manager/team-list');
  };

  if (loading) {
    return (
      <div className="add-user-page">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          Loading user data...
        </div>
      </div>
    );
  }

  if (!currentUser || (currentUser.role_id !== 1 && currentUser.role_id !== '1')) {
    return (
      <div className="add-user-page">
        <div className="add-user-container">
          <div className="form-card">
            <div className="alert alert-error">
              {error || 'You do not have permission to edit user information.'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-user-page">
      <div className="add-user-container">
        <div className="form-card">
          <div className="form-header">
            <h1>Edit User</h1>
            <p>Update user information</p>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter first name"
                disabled={saving}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter last name"
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                disabled={saving}
                required
              />
            </div>

            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="tel"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                placeholder="Enter mobile number"
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label>Department *</label>
              <select
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                disabled={saving}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Role *</label>
              <select
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                disabled={saving}
                required
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
                disabled={saving}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
