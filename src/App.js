import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';
import UsersPage from './components/UsersPage';
import AlbumsPage from './components/AlbumsPage';
import PhotosPage from './components/PhotosPage';
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
            path="/photos/:albumId"
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