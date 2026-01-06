const TeamListAdmin = () => {
  // fake data for design demo
  const admins = [
    { id: 1, name: 'Sonia Yeong', email: 'sonia@kkh.com.sg', mobile: '94321999', access: true },
    { id: 2, name: 'Anderton Lim', email: 'anderton@kkh.com.sg', mobile: '94321888', access: true },
    { id: 3, name: 'Nico Sim', email: 'nico@kkh.com.sg', mobile: '94321777', access: true },
    { id: 4, name: 'Tan Likai', email: 'likai@kkh.com.sg', mobile: '94321666', access: true },
  ];

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
        {admins.map((admin) => (
          <tr key={admin.id}>
            <td>{admin.name}</td>
            <td>{admin.email}</td>
            <td>{admin.mobile}</td>
            <td>
              <label className="switch">
                <input type="checkbox" defaultChecked={admin.access} />
                <span className="slider"></span>
              </label>
            </td>
            <td>...</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TeamListAdmin;