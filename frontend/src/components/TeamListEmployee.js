// Now accepts "data" passed from the parent
const TeamListEmployee = ({ data }) => {
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
        {/* Map through the data passed in */}
        {data && data.map((member) => (
          <tr key={member.id}>
            <td>{member.name}</td>
            <td>{member.email}</td>
            <td>{member.mobile}</td>
            <td>
              <span className="badge-dept">{member.dept}</span>
            </td>
            <td>...</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TeamListEmployee;