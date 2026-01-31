import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { authFetch } from '../../../utils/authFetch';

export default function UserDetails({ user_id }) {
    const navigate = useNavigate(); // 2. Initialize navigation
    const [userDetails, setUserDetails] = useState(null);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!user_id) return;

        const fetchUserDetails = async () => {
            try {
                const res = await authFetch(`http://localhost:5000/auth/user/${user_id}`);
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

            const response = await authFetch(`http://localhost:5000/auth/delete-user/${user_id}`, {
                method: 'PATCH'
            });

            if (!response.ok) {
                throw new Error('Failed to deactivate user');
            }

            // 5. Update local state to reflect change immediately (UI Optimism)
            setUserDetails(prev => ({ ...prev, is_active: false }));

            alert(`${userDetails.first_name} ${userDetails.last_name} has been deactivated successfully.`);
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
                        <div>
                            <h2>Profile</h2>
                            <div className="action-buttons">
                                <button onClick={handleEditClick}>Edit</button>
                                <button
                                    onClick={handleDeactivateClick}
                                    // 6. Disable if already inactive OR currently processing
                                    disabled={userDetails.is_active === false || processing}
                                >
                                    {userDetails.is_active === false ? 'Inactive' : 'Deactivate'}
                                </button>
                            </div>
                        </div>

                        <p><strong>Name:</strong> {userDetails.first_name} {userDetails.last_name}</p>
                        <p><strong>Email:</strong> {userDetails.email}</p>
                        <p><strong>Mobile Number:</strong> {userDetails.mobile_number || 'N/A'}</p>
                        <p><strong>Department:</strong> {userDetails.department_name || userDetails.department_id}</p>

                        {/* Optional: Add a visual indicator of status */}
                        <p><strong>Status:</strong> {userDetails.is_active !== false ? 'Active' : 'Deactivated'}</p>
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