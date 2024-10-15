import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LandingPage from './index';
import { MemoryRouter } from 'react-router-dom';

/**
 * This describe block contains all tests for the LandingPage component.
 * Each test case checks a specific aspect of the component's rendering.
 */
describe('LandingPage Component', () => {
  /**
   * Test to verify if the welcome message is displayed on the page.
   */
  it('should render welcome message', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Welcome!!')).toBeInTheDocument();
  });

  /**
   * Test to check if the app's description text is rendered correctly.
   */
  it('should display the description of the app', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/This app allows users to view data from JSONPlaceholder API/)).toBeInTheDocument();
  });

  /**
   * Test to ensure there's a login button present that links to the login page.
   */
  it('should have a login button with a link to the login page', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole('button', { name: /Login/i });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton.closest('a')).toHaveAttribute('href', '/login');
  });
});