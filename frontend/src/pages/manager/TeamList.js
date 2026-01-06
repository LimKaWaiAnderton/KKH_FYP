import React, { useState } from 'react';
import TeamListEmployee from '../../components/TeamListEmployee';
import TeamListAdmin from '../../components/TeamListAdmin';
import '../../styles/TeamList.css';
import { FiPlusCircle } from "react-icons/fi";

const TeamList = () => {
  const [activeTab, setActiveTab] = useState('members'); // 'members' or 'admins'
  
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 5;

  // fake data for design demo
  const allMembers = [
    { id: 1, name: 'Clara Lim', email: 'clara@kkh.com.sg', mobile: '91234111', dept: 'CE' },
    { id: 2, name: 'Nurul Huda', email: 'nurul@kkh.com.sg', mobile: '91234222', dept: 'CE' },
    { id: 3, name: 'Ravi Kumar', email: 'ravi@kkh.com.sg', mobile: '91234333', dept: 'CE' },
    { id: 4, name: 'Michelle De', email: 'michelle@kkh.com.sg', mobile: '91234444', dept: 'CE' },
    { id: 5, name: 'Charlotte Chia', email: 'charlotte@kkh.com.sg', mobile: '91234555', dept: '56' },
    { id: 6, name: 'Nur Insyirah', email: 'insyirah@kkh.com.sg', mobile: '91234666', dept: '56' },
    { id: 7, name: 'John Doe', email: 'john@kkh.com.sg', mobile: '91234777', dept: 'CE' },
    { id: 8, name: 'Jane Smith', email: 'jane@kkh.com.sg', mobile: '91234888', dept: '56' },
    { id: 9, name: 'Alice Tan', email: 'alice@kkh.com.sg', mobile: '91234999', dept: 'CE' },
    { id: 10, name: 'Bob Lee', email: 'bob@kkh.com.sg', mobile: '91234000', dept: '56' },
  ];

  // Calculation of the slice of data to show on website
  const indexOfLastItem = currentPage * itemsPerPage; // last index of current page
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = allMembers.slice(indexOfFirstItem, indexOfLastItem); //get current members for the page
  const totalPages = Math.ceil(allMembers.length / itemsPerPage); //rounding up to nearest whole number

  // Handlers
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };


  return (
    <div className="team-list-container">
      <div className="page-header">
        <h1 className="page-title">Users</h1>
        <button className="btn-add-new">
        <FiPlusCircle size={20} /> 
        Add New
        </button>
      </div>

      <div className="content-card">
        <div className="tabs-header">
          <button 
            className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`}  // Highlight Active Tab
            onClick={() => setActiveTab('members')} // Switch to Members Tab
          >
            Members
          </button>
          <button 
            className={`tab-btn ${activeTab === 'admins' ? 'active' : ''}`}  
            onClick={() => setActiveTab('admins')}
          >
            Admins
          </button>
        </div>

        <div className="search-bar-wrapper">
          <input type="text" placeholder="Search.." className="search-input"/>
        </div>

        {/* passing calculated data to the component */}
        {activeTab === 'members' ? (
          <TeamListEmployee data={currentMembers} />
        ) : (
          <TeamListAdmin />
        )}

        {/* page number and symbol controls */}
        <div className="pagination">
          <button 
            className="page-btn" 
            onClick={handlePrev} 
            disabled={currentPage === 1}
          >
            &lt; {/* '<' shows the previous page with this symbol */}
          </button>
          
          {Array.from({ length: totalPages }, (_, index) => ( // Create an array with length of total pages
            <button
              key={index + 1} // Page numbers start from 1
              className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(index + 1)} // Set current page on click
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
      </div>
    </div>
  );
};

export default TeamList;