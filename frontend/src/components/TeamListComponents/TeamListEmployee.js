import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../../utils/authFetch';

// TeamListEmployee Component - Displays employee/member users
const TeamListEmployee = ({ data, onUserUpdated }) => {
  console.log('TeamListEmployee rendering with data:', data);
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  const handleEditClick = (member) => {
    navigate(`/manager/edit-user/${member.id}`);
  };

  const handleDeactivateClick = async (member) => {
    const confirmed = window.confirm(
      `Are you sure you want to deactivate ${member.first_name} ${member.last_name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessing(member.id);
      setShowActionMenu(null);

      const response = await authFetch(`http://localhost:5000/auth/delete-user/${member.id}`, {
        method: 'PATCH'
      });

      if (!response.ok) {
        throw new Error('Failed to deactivate user');
      }

      // Refresh the data
      if (onUserUpdated) {
        await onUserUpdated();
      }

      alert(`${member.first_name} ${member.last_name} has been deactivated successfully.`);
    } catch (error) {
      console.error('Error deactivating user:', error);
      alert('Failed to deactivate user. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

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
          <th>Department</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {data && data.length > 0 ? (
          data.map((member) => (
            <tr key={member.id}>
              <td>{`${member.first_name} ${member.last_name}`}</td>
              <td>{member.email}</td>
              <td>{member.mobile_number || 'N/A'}</td>
              <td>
                <span className="badge-dept">{member.department_name || member.department_id}</span>
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
                  onClick={() => toggleActionMenu(member.id)}
                  disabled={processing === member.id}
                >
                  ⋯
                </button>
                {showActionMenu === member.id && (
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
                      onClick={() => handleEditClick(member)}
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
                      onClick={() => handleDeactivateClick(member)}
                      disabled={isUserInactive(member) || processing === member.id}
                      onMouseEnter={(e) => {
                        if (!isUserInactive(member)) {
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
                        cursor: isUserInactive(member) ? 'not-allowed' : 'pointer',
                        color: isUserInactive(member) ? '#ccc' : '#d32f2f',
                        fontSize: '0.8em',
                      }}
                      title={isUserInactive(member) ? "User is already inactive" : ""}
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
              No members to display
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TeamListEmployee;