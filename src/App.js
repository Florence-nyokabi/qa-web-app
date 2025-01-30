import React from 'react';
import { RouterProvider, createBrowserRouter, Navigate, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';
import UsersPage from './components/UsersPage';
import AlbumsPage from './components/AlbumsPage';
import PhotosPage from './components/PhotosPage';
import { AuthProvider, AuthContext } from './components/AuthContext';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const { currentUser } = React.useContext(AuthContext);
  return (
    <Route
      {...rest}
      element={currentUser ? <Element /> : <Navigate to="/login" replace />}
    />
  );
};

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { 
    path: '/home', 
    element: <PrivateRoute element={HomePage} /> 
  },
  { 
    path: '/users', 
    element: <PrivateRoute element={UsersPage} /> 
  },
  { 
    path: '/albums', 
    element: <PrivateRoute element={AlbumsPage} /> 
  },
  { 
    path: '/photos/:albumId', 
    element: <PrivateRoute element={PhotosPage} /> 
  },
], {
  future: {
    v7_startTransition: true,
  },
});

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;