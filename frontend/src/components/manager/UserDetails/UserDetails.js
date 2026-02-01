import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../../../utils/authFetch';

export default function UserDetails({ user_id }) {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState(null);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!user_id) return;

        const fetchUserDetails = async () => {
            try {
                const res = await authFetch(`https://kkh-fyp-backend.onrender.com/auth/user/${user_id}`);
                if (!res.ok) throw new Error("Failed to fetch user details");
                const data = await res.json();
                console.log(data);
                setUserDetails(data);
            } catch (err) {
                console.error("Error fetching user details:", err);
                setError('Failed to load user details. Please try again.');
            }
        };

        fetchUserDetails();
    }, [user_id]);

    // --- FUNCTION 1: EDIT ---
    const handleEditClick = () => {
        navigate(`/manager/edit-user/${user_id}`);
    };

    // --- FUNCTION 2: DEACTIVATE ---
    const handleDeactivateClick = async () => {
        if (!userDetails) return;

        const confirmed = window.confirm(
            `Are you sure you want to deactivate ${userDetails.first_name} ${userDetails.last_name}?`
        );

        if (!confirmed) return;

        try {
            setProcessing(true); // Disable button while loading

            const response = await authFetch(`https://kkh-fyp-backend.onrender.com/auth/delete-user/${user_id}`, {
                method: 'PATCH'
            });

            if (!response.ok) {
                throw new Error('Failed to deactivate user');
            }

            // 5. Update local state to reflect change immediately (UI Optimism)
            setUserDetails(prev => ({ ...prev, is_active: false }));

            alert(`${userDetails.first_name} ${userDetails.last_name} has been deactivated successfully.`);

            navigate(`/manager/team-list`);
        } catch (error) {
            console.error('Error deactivating user:', error);
            alert('Failed to deactivate user. Please try again.');
        } finally {
            setProcessing(false); // Re-enable button (if applicable)
        }
    };

    return (
        <div className="container">
            <div className="user-details-card">
                {userDetails ? (
                    <div>
                        <div className="container-header">
                            <h2>Profile</h2>
                            <div className="action-buttons">
                                <button className="btn-primary" onClick={handleEditClick}>Edit</button>
                                <button
                                    className="btn-danger"
                                    onClick={handleDeactivateClick}
                                    // 6. Disable if already inactive OR currently processing
                                    disabled={userDetails.is_active === false || processing}
                                >
                                    {userDetails.is_active === false ? 'Inactive' : 'Deactivate'}
                                </button>
                            </div>
                        </div>
                        <p><span className="user-details-title">Name:</span> {userDetails.first_name} {userDetails.last_name}</p>
                        <p><span className="user-details-title">Department:</span>  {userDetails.department_name}</p>
                        <p><span className="user-details-title">Email:</span> {userDetails.email}</p>
                        <p><span className="user-details-title">Mobile No.:</span> {userDetails.mobile_number}</p>
                    </div>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <p>Loading user details...</p>
                )}
            </div>
        </div>
    );
}