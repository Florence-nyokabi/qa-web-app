import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useNavigate, Link } from 'react-router-dom'; 

const HomePage = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };
  
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>You are now logged in!</p>
      <nav>
        <ul>
          <li><Link to="/users">Users</Link></li>
          <li><Link to="/albums">Albums</Link></li>
        </ul>
      </nav>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default HomePage;