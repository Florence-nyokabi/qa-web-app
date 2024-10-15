import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth } from '../../firebaseConfig';
import './style.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]); // store user data
  const [loading, setLoading] = useState(true); // loading status
  const [error, setError] = useState(''); // error messages
  const [searchQuery, setSearchQuery] = useState(''); // search query state
  const navigate = useNavigate();

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

  useEffect(() => {
    // Check if the user is authenticated
    const user = auth.currentUser;
    if (!user) {
      navigate('/login'); // If the user is not logged in, redirect to login
    }
  }, [navigate]);

  if (loading) return <p>Loading users...</p>; 
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>Users List</h2>
      
      {/* Search Input */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '10px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <p>
        <Link to="/home">Go Back to Home</Link>
      </p>
      
      <ul>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <li key={user.id}>
              <strong>{user.name}</strong> - {user.email}
              <p>{user.address.street}, {user.address.city}</p>
            </li>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </ul>
    </div>
  );
};

export default UsersPage;
