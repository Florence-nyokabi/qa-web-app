import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import UsersPage from './index';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

// Mocking Firebase auth to avoid initialization errors during tests
jest.mock('../../firebaseConfig', () => ({
  auth: {
    currentUser: null,
  },
}));

/**
 * This describe block contains tests for the UsersPage component.
 * Each test case simulates different scenarios like successful data loading, error states, and user interactions.
 */
describe('UsersPage Component', () => {
  let mockAxios;

  // Set up the axios mock adapter before each test to intercept API calls
  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  // Reset the axios mock adapter after each test to ensure clean state for subsequent tests
  afterEach(() => {
    mockAxios.reset();
  });

  /**
   * Test case to check if the component correctly displays user data after fetching it from the API.
   * It verifies that the loading message disappears and user details are shown.
   */
  it('should display users after loading', async () => {
    const mockData = [
      {
        id: 1,
        name: 'Leanne Graham',
        email: 'Sincere@april.biz',
        address: {
          street: 'Kulas Light',
          city: 'Gwenborough'
        }
      }
    ];

    mockAxios.onGet('https://jsonplaceholder.typicode.com/users').reply(200, mockData);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <UsersPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => expect(screen.queryByText('Loading users...')).not.toBeInTheDocument());

    expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    expect(screen.getByText('Kulas Light, Gwenborough')).toBeInTheDocument();
  });

  /**
   * Test case for search functionality within the UsersPage.
   * It checks if the search input filters users correctly based on the entered text.
   */
  it('should handle search functionality', async () => {
    const mockData = [
      {
        id: 1,
        name: 'Leanne Graham',
        email: 'Sincere@april.biz',
        address: {
          street: 'Kulas Light',
          city: 'Gwenborough'
        }
      }
    ];

    mockAxios.onGet('https://jsonplaceholder.typicode.com/users').reply(200, mockData);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <UsersPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => expect(screen.queryByText('Loading users...')).not.toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText('Search users...');
    fireEvent.change(searchInput, { target: { value: 'Leanne' } });

    await waitFor(() => expect(screen.getByText('Leanne Graham')).toBeInTheDocument());
  });

  /**
   * Test to verify that an error message is shown when the user fetch fails.
   * Simulates an API error response to check for proper error handling in the UI.
   */
  it('should show error message when users fail to load', async () => {
    mockAxios.onGet('https://jsonplaceholder.typicode.com/users').reply(500);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <UsersPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => expect(screen.getByText('Failed to fetch users.')).toBeInTheDocument());
  });

  /**
   * Test to ensure the component displays a "No users found" message when no users match the search criteria.
   * This tests the filtering logic when no results are returned.
   */
  it('should show "No users found." message when no users match the search', async () => {
    const mockData = [
      {
        id: 1,
        name: 'Leanne Graham',
        email: 'Sincere@april.biz',
        address: {
          street: 'Kulas Light',
          city: 'Gwenborough'
        }
      }
    ];

    mockAxios.onGet('https://jsonplaceholder.typicode.com/users').reply(200, mockData);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <UsersPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => expect(screen.queryByText('Loading users...')).not.toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText('Search users...');
    fireEvent.change(searchInput, { target: { value: 'NonExistent' } });

    await waitFor(() => expect(screen.getByText('No users found.')).toBeInTheDocument());
  });
});