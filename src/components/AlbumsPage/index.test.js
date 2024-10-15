import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AlbumsPage from './index';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

/**
 * This describe block contains all tests for the AlbumsPage component.
 * Each test case is designed to verify a specific functionality of the component.
 */
describe('AlbumsPage Component', () => {
  let mockAxios;

  // Set up the axios mock adapter before each test
  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  // Reset the axios mock adapter after each test to ensure a clean state
  afterEach(() => {
    mockAxios.reset();
  });

  /**
   * Test to ensure that the component shows a loading message while fetching data.
   */
  it('should render loading message initially', async () => {
    // Mock an empty response to simulate initial loading state
    mockAxios.onGet('https://jsonplaceholder.typicode.com/albums').reply(200, []);

    render(
      <RouterProvider 
        router={createBrowserRouter([
          {
            path: '/',
            element: <AlbumsPage />
          }
        ], {
          future: {
            v7_startTransition: true,
          },
        })}
      />
    );

    // Wait for the loading message to appear
    await waitFor(() => expect(screen.getByText('Loading albums...')).toBeInTheDocument());
  });

  /**
   * Test to check if albums are correctly displayed after the data is loaded.
   */
  it('should display albums after loading', async () => {
    const mockData = [
      {
        userId: 1,
        id: 1,
        title: 'quidem molestiae enim'
      },
      {
        userId: 1,
        id: 2,
        title: 'sunt qui excepturi placeat culpa'
      }
    ];

    // Mock a successful response with album data
    mockAxios.onGet('https://jsonplaceholder.typicode.com/albums').reply(200, mockData);

    render(
      <RouterProvider 
        router={createBrowserRouter([
          {
            path: '/',
            element: <AlbumsPage />
          }
        ], {
          future: {
            v7_startTransition: true,
          },
        })}
      />
    );

    // Wait for the loading message to disappear
    await waitFor(() => expect(screen.queryByText('Loading albums...')).not.toBeInTheDocument());

    // Check if the first two albums are rendered
    expect(screen.getByText(/quidem molestiae enim/i)).toBeInTheDocument();
    expect(screen.getByText(/sunt qui excepturi placeat culpa/i)).toBeInTheDocument();
  });

  /**
   * Test to verify the search functionality filters albums correctly.
   */
  it('should handle search functionality', async () => {
    const mockData = [
      {
        userId: 1,
        id: 1,
        title: 'quidem molestiae enim'
      },
      {
        userId: 1,
        id: 2,
        title: 'sunt qui excepturi placeat culpa'
      }
    ];

    // Mock album data for search functionality test
    mockAxios.onGet('https://jsonplaceholder.typicode.com/albums').reply(200, mockData);

    render(
      <RouterProvider 
        router={createBrowserRouter([
          {
            path: '/',
            element: <AlbumsPage />
          }
        ], {
          future: {
            v7_startTransition: true,
          },
        })}
      />
    );

    await waitFor(() => expect(screen.queryByText('Loading albums...')).not.toBeInTheDocument());

    // Perform a search for 'quidem'
    const searchInput = screen.getByPlaceholderText('Search albums by title or ID...');
    fireEvent.change(searchInput, { target: { value: 'quidem' } });

    // Wait for the search results to update
    await waitFor(() => {
      expect(screen.getByText(/quidem molestiae enim/i)).toBeInTheDocument();
      expect(screen.queryByText(/sunt qui excepturi placeat culpa/i)).not.toBeInTheDocument();
    });
  });

  /**
   * Test to confirm pagination works as expected, moving between pages of albums.
   */
  it('should handle pagination', async () => {
    const mockData = Array(20).fill().map((_, i) => ({
      userId: 1,
      id: i + 1,
      title: `Album Title ${i + 1}`
    }));

    // Mock data for more than one page to test pagination
    mockAxios.onGet('https://jsonplaceholder.typicode.com/albums').reply(200, mockData);

    render(
      <RouterProvider 
        router={createBrowserRouter([
          {
            path: '/',
            element: <AlbumsPage />
          }
        ], {
          future: {
            v7_startTransition: true,
          },
        })}
      />
    );

    await waitFor(() => expect(screen.queryByText('Loading albums...')).not.toBeInTheDocument());

    // Check initial page
    expect(screen.getByText('Album Title 1')).toBeInTheDocument();
    expect(screen.queryByText('Album Title 11')).not.toBeInTheDocument();

    // Navigate to next page
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    // Check if page has changed to show the next set of albums
    await waitFor(() => {
      expect(screen.getByText('Album Title 11')).toBeInTheDocument();
      expect(screen.queryByText('Album Title 1')).not.toBeInTheDocument();
    });

    // Navigate back to previous page
    const previousButton = screen.getByRole('button', { name: /Previous/i });
    fireEvent.click(previousButton);

    // Check if back on the first page
    await waitFor(() => {
      expect(screen.queryByText('Album Title 11')).not.toBeInTheDocument();
      expect(screen.getByText('Album Title 1')).toBeInTheDocument();
    });
  });

  /**
   * Test to ensure an error message is displayed when album fetching fails.
   */
  it('should show error message when albums fail to load', async () => {
    // Mock a server error to test error handling
    mockAxios.onGet('https://jsonplaceholder.typicode.com/albums').reply(500);

    render(
      <RouterProvider 
        router={createBrowserRouter([
          {
            path: '/',
            element: <AlbumsPage />
          }
        ], {
          future: {
            v7_startTransition: true,
          },
        })}
      />
    );

    // Wait for the error message to appear
    await waitFor(() => expect(screen.getByText('Failed to fetch albums.')).toBeInTheDocument());
  });

  /**
   * Test to check if the "No albums found" message appears when search yields no results.
   */
  it('should show "No albums found." message when no albums match the search', async () => {
    const mockData = [
      {
        userId: 1,
        id: 1,
        title: 'quidem molestiae enim'
      }
    ];

    // Mock data with only one album to ensure no match on search
    mockAxios.onGet('https://jsonplaceholder.typicode.com/albums').reply(200, mockData);

    render(
      <RouterProvider 
        router={createBrowserRouter([
          {
            path: '/',
            element: <AlbumsPage />
          }
        ], {
          future: {
            v7_startTransition: true,
          },
        })}
      />
    );

    await waitFor(() => expect(screen.queryByText('Loading albums...')).not.toBeInTheDocument());

    // Search for a term that would yield no results
    const searchInput = screen.getByPlaceholderText('Search albums by title or ID...');
    fireEvent.change(searchInput, { target: { value: 'NonExistent' } });

    // Check for the "No albums found" message
    await waitFor(() => expect(screen.getByText('No albums found.')).toBeInTheDocument());
  });
});