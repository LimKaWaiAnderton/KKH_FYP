import React, { useState, useEffect } from 'react';
import TeamListEmployee from '../../components/TeamListEmployee';
import TeamListAdmin from '../../components/TeamListAdmin';
import '../../styles/TeamList.css';
import { FiPlusCircle } from "react-icons/fi";
import { authFetch } from '../../utils/authFetch'; // Import your utility

const TeamList = () => {
  const [activeTab, setActiveTab] = useState('members');
  const [members, setMembers] = useState([]); // Real data state
  const [admins, setAdmins] = useState([]);   // Real data state
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch users from database on component mount
  useEffect(() => {
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/users'); 
      const allData = await res.json();

      //Filters out users where is_active is false
      const activeUsers = allData.filter(u => u.is_active !== false);

      //populate your tabs
      setAdmins(activeUsers.filter(u => u.role_id === 1 || u.role_id === "1"));
      setMembers(activeUsers.filter(u => u.role_id === 2 || u.role_id === "2"));
      
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchUsers();
}, []);

  const currentData = activeTab === 'members' ? members : admins;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = currentData.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) return <div>Loading Team List...</div>;

  return (
    <div className="team-list-container">
      <div className="page-header">
        <h1 className="page-title">Users</h1>
            <button className="btn-add-new" onClick={() => setIsModalOpen(true)}>
            <FiPlusCircle size={20} /> Add New
            </button>
      </div>
       {isModalOpen && (
        <AddUser 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            // Refresh list logic here
          }}
        />
      )}
      <div className="content-card">
        <div className="tabs-header">
          <button className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`} onClick={() => setActiveTab('members')}>
            Members
          </button>
          <button className={`tab-btn ${activeTab === 'admins' ? 'active' : ''}`} onClick={() => setActiveTab('admins')}>
            Admins
          </button>
        </div>

        {activeTab === 'members' ? (
          <TeamListEmployee data={currentItems} />
        ) : (
          <TeamListAdmin data={currentItems} />
        )}

        {/* Pagination logic remains the same, using totalPages calculated from database data */}
      </div>
    </div>
  );
};

export default TeamList;