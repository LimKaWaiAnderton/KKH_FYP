import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TeamListEmployee from '../../components/TeamListComponents/TeamListEmployee';
import TeamListAdmin from '../../components/TeamListComponents/TeamListAdmin';
import '../../styles/TeamList.css';
import { FiPlusCircle } from "react-icons/fi";
import { authFetch } from '../../utils/authFetch';

const TeamList = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Check if we're returning from AddUser

  const [activeTab, setActiveTab] = useState('members');
  const [allUsers, setAllUsers] = useState([]); // Store all users from backend
  const [currentUser, setCurrentUser] = useState(null); // Store current logged-in user's ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch current user's info
  const fetchCurrentUser = async () => {
    try {
      const res = await authFetch('http://localhost:5000/auth/me');
      if (!res.ok) throw new Error("Failed to fetch current user");
      const data = await res.json();
      setCurrentUser(data.id);
      console.log('Current user ID:', data.id);
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching users from backend...');
      // Ensure the path matches the backend route exactly
      const res = await authFetch('http://localhost:5000/auth/users');
      
      if (!res.ok) throw new Error("Failed to fetch users");
      
      const data = await res.json();
      console.log('Users fetched successfully:', data.length, 'users');
      const activeUsers = data.filter(u => u.is_active !== false);

      setAllUsers(activeUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError('Failed to load team list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount and when returning from AddUser
  useEffect(() => {
    console.log('TeamList mounted or refresh triggered');
    fetchCurrentUser();
    fetchUsers();
    
    // Clear the refresh flag from navigation state to prevent unnecessary re-fetches
    if (location.state?.refresh) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.refresh]);

  // Separate users by role
  const members = allUsers.filter(u => u.role_id === 2 || u.role_id === '2');
  const admins = allUsers.filter(u => u.role_id === 1 || u.role_id === '1');

  console.log('All users:', allUsers.length);
  console.log('Members:', members.length);
  console.log('Admins:', admins.length);

  // Get current tab data
  const currentTabData = activeTab === 'members' ? members : admins;
  const totalPages = Math.ceil(currentTabData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = currentTabData.slice(indexOfFirstItem, indexOfLastItem);

  console.log('Current tab:', activeTab, '| Current items:', currentItems.length);

  // Reset pagination when switching tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Pagination handlers
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Handler for Add New User button - navigates to add-user page
  const handleAddUserClick = () => {
    navigate('/manager/add-user');
  };

  // Handler to switch to members tab (called when admin is demoted)
  const handleSwitchToMembers = () => {
    setActiveTab('members');
  };

  if (loading) {
    return (
      <div className="team-list-container">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          Loading team list...
        </div>
      </div>
    );
  }

  return (
    <div className="team-list-container">
      <div className="page-header">
        <h1 className="page-title">Users</h1>
        <button className="btn-add-new" onClick={handleAddUserClick}>
          <FiPlusCircle size={20} /> 
          Add New
        </button>
      </div>

      {error && (
        <div style={{ 
          padding: '15px', 
          margin: '10px 0', 
          backgroundColor: '#fee',
          color: '#c33',
          borderRadius: '4px',
          border: '1px solid #fcc'
        }}>
          {error}
        </div>
      )}

      <div className="content-card">
        <div className="tabs-header">
          <button 
            className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            Members ({members.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'admins' ? 'active' : ''}`}
            onClick={() => setActiveTab('admins')}
          >
            Admins ({admins.length})
          </button>
        </div>

        <div className="search-bar-wrapper">
          <input type="text" placeholder="Search.." className="search-input"/>
        </div>

        {/* Display current tab data or empty message */}
        {currentTabData.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            No {activeTab === 'members' ? 'members' : 'admins'} found.
          </div>
        ) : (
          <>
            {activeTab === 'members' ? (
              <TeamListEmployee data={currentItems} onUserUpdated={fetchUsers} />
            ) : (
              <TeamListAdmin 
                data={currentItems} 
                currentUserId={currentUser}
                onUserUpdated={fetchUsers}
                onSwitchToMembers={handleSwitchToMembers}
              />
            )}

            {/* Pagination controls - only show if there are multiple pages */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="page-btn" 
                  onClick={handlePrev} 
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                <button 
                  className="page-btn" 
                  onClick={handleNext} 
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TeamList;