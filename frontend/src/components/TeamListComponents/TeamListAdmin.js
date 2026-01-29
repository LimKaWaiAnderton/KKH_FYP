import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../../utils/authFetch';

// TeamListAdmin Component - Displays admin users
const TeamListAdmin = ({ data, currentUserId, onUserUpdated, onSwitchToMembers }) => {
  console.log('TeamListAdmin rendering with data:', data);
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  const handleEditClick = (admin) => {
    navigate(`/manager/edit-user/${admin.id}`);
  };

  const handleAdminAccessToggle = async (admin, isChecked) => {
    // If turning OFF admin access, show confirmation
    if (!isChecked) {
      const confirmed = window.confirm(
        `Are you sure you want to remove admin access for ${admin.first_name} ${admin.last_name}?\n\nThis user will lose admin privileges and will be moved to the Members list.`
      );
      
      if (!confirmed) {
        // User cancelled, revert the checkbox by re-rendering
        return;
      }

      try {
        setProcessing(admin.id);
        
        // Call backend to update user role to regular user (role_id: 2)
        const response = await authFetch(`http://localhost:5000/auth/update-role/${admin.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ role_id: 2 })
        });

        if (!response.ok) {
          throw new Error('Failed to update user role');
        }

        // Notify parent to refresh data and switch to members tab
        if (onUserUpdated) {
          await onUserUpdated();
        }
        
        // Switch to members tab to show where the user was moved
        if (onSwitchToMembers) {
          onSwitchToMembers();
        }

        alert(`${admin.first_name} ${admin.last_name} has been moved to Members.`);
      } catch (error) {
        console.error('Error updating user role:', error);
        alert('Failed to update user role. Please try again.');
        // Refresh to restore correct state
        if (onUserUpdated) {
          onUserUpdated();
        }
      } finally {
        setProcessing(null);
      }
    }
    // If turning ON admin access (shouldn't happen in this view, but handle it)
    // Admin users should always have admin access in this list
  };

  const handleDeactivateClick = async (admin) => {
    const confirmed = window.confirm(
      `Are you sure you want to deactivate ${admin.first_name} ${admin.last_name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessing(admin.id);
      setShowActionMenu(null);

      const response = await authFetch(`http://localhost:5000/auth/delete-user/${admin.id}`, {
        method: 'PATCH'
      });

      if (!response.ok) {
        throw new Error('Failed to deactivate user');
      }

      // Refresh the data
      if (onUserUpdated) {
        await onUserUpdated();
      }

      alert(`${admin.first_name} ${admin.last_name} has been deactivated successfully.`);
    } catch (error) {
      console.error('Error deactivating user:', error);
      alert('Failed to deactivate user. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  const isCurrentUser = (userId) => userId === currentUserId;
  const isUserInactive = (user) => user.is_active === false;

  const toggleActionMenu = (userId) => {
    setShowActionMenu(showActionMenu === userId ? null : userId);
  };

  return (
    <table className="custom-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Mobile No.</th>
          <th>Admin access</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {data && data.length > 0 ? (
          data.map((admin) => (
            <tr key={admin.id}>
              <td>{`${admin.first_name} ${admin.last_name}`}</td>
              <td>{admin.email}</td>
              <td>{admin.mobile_number || 'N/A'}</td>
              <td>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={true}
                    disabled={processing === admin.id}
                    onChange={(e) => handleAdminAccessToggle(admin, e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </td>
              <td style={{ position: 'relative', textAlign: 'center' }}>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1em',
                    padding: '0 8px',
                  }}
                  onClick={() => toggleActionMenu(admin.id)}
                  disabled={processing === admin.id}
                >
                  ⋯
                </button>
                {showActionMenu === admin.id && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '100%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      padding: '0',
                      zIndex: 1000,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      display: 'flex',
                      whiteSpace: 'nowrap',
                      marginRight: '4px',
                    }}
                  >
                    <button
                      onClick={() => handleEditClick(admin)}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#e3f2fd';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                      style={{
                        padding: '6px 12px',
                        border: 'none',
                        borderRight: '1px solid #ddd',
                        background: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: '#105bcb',
                        fontSize: '0.8em',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeactivateClick(admin)}
                      disabled={isCurrentUser(admin.id) || isUserInactive(admin) || processing === admin.id}
                      onMouseEnter={(e) => {
                        if (!isCurrentUser(admin.id) && !isUserInactive(admin)) {
                          e.target.style.backgroundColor = '#ffebee';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                      style={{
                        padding: '6px 12px',
                        border: 'none',
                        background: 'none',
                        textAlign: 'left',
                        cursor: isCurrentUser(admin.id) || isUserInactive(admin) ? 'not-allowed' : 'pointer',
                        color: isCurrentUser(admin.id) || isUserInactive(admin) ? '#ccc' : '#d32f2f',
                        fontSize: '0.8em',
                      }}
                      title={
                        isCurrentUser(admin.id) ? "Cannot deactivate yourself" :
                        isUserInactive(admin) ? "User is already inactive" :
                        ""
                      }
                    >
                      Deactivate
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              No admins to display
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TeamListAdmin;