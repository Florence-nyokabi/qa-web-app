import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import HomePage from './components/HomePage/HomePage';
import UsersPage from './components/UsersPage/UsersPage';
import AlbumsPage from './components/AlbumsPage/AlbumsPage';
import PhotosPage from './components/PhotosPage/PhotosPage';

import { AuthProvider, AuthContext } from './components/AuthContext';


const PrivateRoute = ({ children }) => {
  const { currentUser } = React.useContext(AuthContext);
  return currentUser ? children : <Navigate to="/login" />;
};


const App = () => {
    return (
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <UsersPage /> 
                </PrivateRoute>
              }
            />
            <Route
              path="/albums"
              element={
                <PrivateRoute>
                  <AlbumsPage /> 
                </PrivateRoute>
              }
            />
            <Route
              path="/photos"
              element={
                <PrivateRoute>
                  <PhotosPage /> 
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    );
};

export default App;