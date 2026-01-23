// TeamListEmployee Component - Displays employee/member users
const TeamListEmployee = ({ data }) => {
  console.log('TeamListEmployee rendering with data:', data);
  
  return (
    <table className="custom-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Mobile No.</th>
          <th>Department</th>
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
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              No members to display
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TeamListEmployee;