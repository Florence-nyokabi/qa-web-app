import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

import './style.css'; 

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const [resetEmail, setResetEmail] = useState(''); //  reset email
  const [resetError, setResetError] = useState(''); // reset error

  const [isResetVisible, setIsResetVisible] = useState(false); //  reset email form
  const [showPassword, setShowPassword] = useState(false); // toggle password visibility
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');  
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert('Password reset email sent! Check your inbox.'); 
      setIsResetVisible(false); 
    } catch (err) {
      setResetError(err.message);
    }
  };

  
  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin} data-testid="form">
        <div data-testid="email">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ position: 'relative' }} data-testid="password">
          <label htmlFor="password">Password:</label>
          <input
            type={showPassword ? 'text' : 'password'} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            data-testid="showPassword"
            onClick={() => setShowPassword(!showPassword)} 
            style={{
              position: 'absolute',
              right: '10px',
              top: '35px',
              cursor: 'pointer',
            }}
            >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </span>
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
      <p>
        <button onClick={() => setIsResetVisible(true)}>Forgot Password?</button>
      </p>

      {isResetVisible && (
        <div>
          <h3>Reset Password</h3>
          {resetError && <p style={{ color: 'red' }}>{resetError}</p>}
          <form onSubmit={handleResetPassword}>
            <div>
              <label>Enter your email:</label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit">Send Reset Email</button>
          </form>
          <button onClick={() => setIsResetVisible(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;