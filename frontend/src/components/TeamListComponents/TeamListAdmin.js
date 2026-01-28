import { useState } from 'react';
import { authFetch } from '../../utils/authFetch';

// TeamListAdmin Component - Displays admin users
const TeamListAdmin = ({ data, onUserUpdated, onSwitchToMembers }) => {
  console.log('TeamListAdmin rendering with data:', data);
  const [processing, setProcessing] = useState(null);

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
              <td>...</td>
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