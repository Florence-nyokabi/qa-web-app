import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

import './UsersPage.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]); // store user data
  const [loading, setLoading] = useState(true); //  loading status
  const [error, setError] = useState(''); //  error messages

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        setUsers(response.data); 
      } catch (err) {
        setError('Failed to fetch users.'); 
      } finally {
        setLoading(false); 
      }
    };

  fetchUsers(); 
}, []); 

if (loading) return <p>Loading users...</p>; 
if (error) return <p style={{ color: 'red' }}>{error}</p>;

return (
  <div>
    <h2>Users List</h2>
    <p>
      <Link to="/home">Go Back to Home</Link>
    </p>
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <strong>{user.name}</strong> - {user.email}
          <p>{user.address.street}, {user.address.city}</p>
        </li>
      ))}
    </ul>
  </div>
  );
};

export default UsersPage;