import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from './index';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { auth } from '../../firebaseConfig';

// Mocking the signOut function from Firebase and the navigation hook to control and verify their behavior in tests
jest.mock('firebase/auth', () => ({
  signOut: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('../../firebaseConfig', () => ({
  auth: { currentUser: null },
}));

/**
 * This describe block contains all tests for the HomePage component.
 * Each test case checks a different aspect of the component's functionality.
 */
describe('HomePage Component', () => {
  /**
   * Test to verify if the welcome message is rendered on the HomePage.
   */
  it('renders welcome message', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Welcome to the Home Page')).toBeInTheDocument();
    expect(screen.getByText('You are now logged in!')).toBeInTheDocument();
  });

  /**
   * Test to check if navigation links for Users and Albums are displayed.
   */
  it('displays navigation links to Users and Albums pages', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Albums')).toBeInTheDocument();
  });

  /**
   * Test to ensure a logout button is present on the page.
   */
  it('displays a logout button', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });

  /**
   * Test for logout functionality. 
   * It checks if clicking the logout button invokes Firebase's signOut method and attempts navigation to the login page.
   */
  it('triggers signOut and navigation on logout click', async () => {
    const mockSignOut = jest.fn(() => Promise.resolve());
    const mockNavigate = jest.fn();
    require('firebase/auth').signOut = mockSignOut;
    require('react-router-dom').useNavigate = () => mockNavigate;

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutButton);

    // Check if signOut was called
    expect(mockSignOut).toHaveBeenCalledTimes(1);
    // Check if navigation to login page was attempted
    await Promise.resolve(); // Wait for any async operations to complete
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  /**
   * Test to ensure clicking on navigation links changes the route correctly.
   * It simulates clicking on "Users" and "Albums" links and checks if the corresponding pages are shown.
   */
  it('navigates to Users and Albums when links are clicked', async () => {
    const mockNavigate = jest.fn();
    require('react-router-dom').useNavigate = () => mockNavigate;

    // Use a custom render function to wrap the component with MemoryRouter and Routes
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<div data-testid="users-page">Users Page</div>} />
          <Route path="/albums" element={<div data-testid="albums-page">Albums Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Click Users link
    fireEvent.click(getByText('Users'));
    
    // Check if Users page is rendered
    expect(screen.getByTestId('users-page')).toBeInTheDocument();
    
    // Reset the history to go back to home
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<div data-testid="users-page">Users Page</div>} />
          <Route path="/albums" element={<div data-testid="albums-page">Albums Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Click Albums link
    fireEvent.click(getByText('Albums'));

    // Check if Albums page is rendered
    expect(screen.getByTestId('albums-page')).toBeInTheDocument();
  });
});