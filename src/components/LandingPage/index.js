import React from 'react';
import { Link } from 'react-router-dom';

import './style.css';

const LandingPage = () => {
  return (
    <div>
      <h1>Welcome!!</h1>
      <p>This app allows users to view data from JSONPlaceholder API. Please log in to access the app.</p>
      <Link to="/login">
        <button>Login</button>
      </Link>
    </div>
  );
};

export default LandingPage;