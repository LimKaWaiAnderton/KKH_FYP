import React, { useState, useEffect } from 'react';
import { authFetch } from '../utils/authFetch';
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineOfficeBuilding, HiOutlineBriefcase } from 'react-icons/hi';
import Header from './Header/Header';
import '../styles/Settings.css';

export default function Settings() {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditingJobScope, setIsEditingJobScope] = useState(false);
    const [jobScope, setJobScope] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    // Fetch user profile
    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const res = await authFetch('http://localhost:5000/auth/me');
            if (!res.ok) throw new Error('Failed to fetch user profile');
            
            const userData = await res.json();
            
            // Check if user is admin
            setIsAdmin(userData.role_id === 1 || userData.role_id === '1');
            
            // Fetch full user details including department
            const userDetailsRes = await authFetch(`http://localhost:5000/auth/users`);
            if (!userDetailsRes.ok) throw new Error('Failed to fetch user details');
            
            const allUsers = await userDetailsRes.json();
            const currentUser = allUsers.find(u => u.id === userData.id);
            
            setUserProfile(currentUser);
            setJobScope(currentUser.job_scope || 'Senior Nurse');
        } catch (error) {
            console.error('Error fetching user profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleSaveJobScope = () => {
        // TODO: Add API call to save job scope
        console.log('Saving job scope:', jobScope);
        setIsEditingJobScope(false);
    };

    if (loading) {
        return (
            <div className="settings-container">
                <Header title="Settings" />
                <div className="settings-loading">Loading profile...</div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="settings-container">
                <Header title="Settings" />
                <div className="settings-error">Failed to load user profile</div>
            </div>
        );
    }

    return (
        <div className="settings-container">
            <Header title="Settings" />
            
            <div className="settings-content">
                {/* Profile Section */}
                <div className="profile-section">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            <HiOutlineUser size={48} />
                        </div>
                        <div className="profile-name">
                            <h2>{`${userProfile.first_name} ${userProfile.last_name}`}</h2>
                            <div className="job-scope-section">
                                {isAdmin && isEditingJobScope ? (
                                    <div className="job-scope-edit">
                                        <input
                                            type="text"
                                            value={jobScope}
                                            onChange={(e) => setJobScope(e.target.value)}
                                            placeholder="Enter job scope"
                                            className="job-scope-input"
                                        />
                                        <button onClick={handleSaveJobScope} className="btn-save">Save</button>
                                        <button onClick={() => setIsEditingJobScope(false)} className="btn-cancel-edit">Cancel</button>
                                    </div>
                                ) : (
                                    <div className="job-scope-display">
                                        <HiOutlineBriefcase size={16} />
                                        <span>{jobScope}</span>
                                        {isAdmin && (
                                            <button onClick={() => setIsEditingJobScope(true)} className="btn-edit">Edit</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* General Info */}
                    <div className="general-info">
                        <h3>General Information</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <div className="info-icon">
                                    <HiOutlineMail size={20} />
                                </div>
                                <div className="info-content">
                                    <label>Email</label>
                                    <p>{userProfile.email}</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">
                                    <HiOutlinePhone size={20} />
                                </div>
                                <div className="info-content">
                                    <label>Phone Number</label>
                                    <p>{userProfile.mobile_number || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">
                                    <HiOutlineOfficeBuilding size={20} />
                                </div>
                                <div className="info-content">
                                    <label>Department</label>
                                    <p>{userProfile.department_name || `Department ${userProfile.department_id}`}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}