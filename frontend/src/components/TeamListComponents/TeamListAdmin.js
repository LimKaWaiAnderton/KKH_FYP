// TeamListAdmin Component - Displays admin users
const TeamListAdmin = ({ data }) => {
  console.log('TeamListAdmin rendering with data:', data);
  
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
                  <input type="checkbox" defaultChecked={true} />
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