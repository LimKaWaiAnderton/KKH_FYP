const mockAuth = (req, res, next) => {
    req.user = {
      id: '43f7e8dc-365b-4aa1-ace6-44b790687780',
      role: 'user'
    };
    // req.user = {
    //     id: 'a1b2c3d4-e5f6-7890-1234-abcdef987654',
    //     role: 'admin'
    //   };
    next();
  };

  export default mockAuth;