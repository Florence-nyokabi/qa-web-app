import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PhotosPage from './index';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

/**
 * This describe block contains all tests for the PhotosPage component.
 * Each test case checks a specific aspect of the component's functionality.
 */
describe('PhotosPage Component', () => {
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
   * Test to verify that the loading state is shown when photos are being fetched.
   * Note: This test might fail if PhotosPage uses router context. 
   * Consider wrapping it with RouterProvider if it does.
   */
  it('should render loading initially', async () => {
    // Mock an empty response to simulate initial loading state
    mockAxios.onGet('https://jsonplaceholder.typicode.com/photos').reply(200, []);

    render(
      <RouterProvider 
        router={createBrowserRouter([
          {
            path: '/',
            element: <PhotosPage />
          }
        ], {
          future: {
            v7_startTransition: true,
          },
        })}
      />
    );

    // Wait for the loader to appear
    await waitFor(() => expect(screen.getByTestId('loader')).toBeInTheDocument());
  });

  /**
   * Test to check if photos are correctly displayed after the data is loaded.
   */
  it('should display photos after loading', async () => {
    const mockData = [
      {
        albumId: 1,
        id: 1,
        title: 'accusamus beatae ad facilis cum similique qui sunt',
        url: 'https://via.placeholder.com/600/92c952',
        thumbnailUrl: 'https://via.placeholder.com/150/92c952'
      },
      {
        albumId: 1,
        id: 2,
        title: 'reprehenderit est deserunt velit ipsam',
        url: 'https://via.placeholder.com/600/771796',
        thumbnailUrl: 'https://via.placeholder.com/150/771796'
      }
    ];

    // Mock a successful response with photo data
    mockAxios.onGet('https://jsonplaceholder.typicode.com/photos').reply(200, mockData);

    render(
      <RouterProvider 
        router={createBrowserRouter([
          {
            path: '/',
            element: <PhotosPage />
          }
        ], {
          future: {
            v7_startTransition: true,
          },
        })}
      />
    );

    // Wait for the loading state to disappear
    await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeInTheDocument());

    // Check if the first two photos are rendered
    expect(screen.getByText(/accusamus beatae ad facilis cum similique qui sunt/i)).toBeInTheDocument();
    expect(screen.getByText(/reprehenderit est deserunt velit ipsam/i)).toBeInTheDocument();
  });

  /**
   * Test to verify the search functionality filters photos correctly.
   */
  it('should handle search functionality', async () => {
    const mockData = [
      {
        albumId: 1,
        id: 1,
        title: 'accusamus beatae ad facilis cum similique qui sunt',
        url: 'https://via.placeholder.com/600/92c952',
        thumbnailUrl: 'https://via.placeholder.com/150/92c952'
      },
      {
        albumId: 1,
        id: 2,
        title: 'reprehenderit est deserunt velit ipsam',
        url: 'https://via.placeholder.com/600/771796',
        thumbnailUrl: 'https://via.placeholder.com/150/771796'
      }
    ];

    // Mock photo data for search functionality test
    mockAxios.onGet('https://jsonplaceholder.typicode.com/photos').reply(200, mockData);

    render(
      <RouterProvider 
        router={createBrowserRouter([
          {
            path: '/',
            element: <PhotosPage />
          }
        ], {
          future: {
            v7_startTransition: true,
          },
        })}
      />
    );

    // Wait for photos to load
    await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeInTheDocument());

    // Perform a search for 'accusamus'
    const searchInput = screen.getByPlaceholderText('Search by title or ID...');
    fireEvent.change(searchInput, { target: { value: 'accusamus' } });

    // Wait for the search results to update
    await waitFor(() => {
      expect(screen.getByText(/accusamus beatae ad facilis cum similique qui sunt/i)).toBeInTheDocument();
      expect(screen.queryByText(/reprehenderit est deserunt velit ipsam/i)).not.toBeInTheDocument();
    });
  });

  /**
   * Test to confirm pagination works as expected, moving between pages of photos.
   */
  it('should handle pagination', async () => {
    const mockData = [
      ...Array(10).fill().map((_, i) => ({
        albumId: 1,
        id: i + 1,
        title: `Photo Title ${i + 1}`,
        url: `https://via.placeholder.com/600/${i + 1}12345`,
        thumbnailUrl: `https://via.placeholder.com/150/${i + 1}12345`
      }))
    ];

    // Mock data for more than one page to test pagination
    mockAxios.onGet('https://jsonplaceholder.typicode.com/photos').reply(200, mockData);

    render(
      <RouterProvider 
        router={createBrowserRouter([
          {
            path: '/',
            element: <PhotosPage />
          }
        ], {
          future: {
            v7_startTransition: true,
          },
        })}
      />
    );

    await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeInTheDocument());

    // Check initial page
    expect(screen.getByText(/Photo Title 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/Photo Title 5/i)).not.toBeInTheDocument();

    // Navigate to next page
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    // Check if page has changed to show the next set of photos
    await waitFor(() => {
      expect(screen.getByText(/Photo Title 5/i)).toBeInTheDocument();
      expect(screen.queryByText(/Photo Title 1/i)).not.toBeInTheDocument();
    });

    // Navigate back to previous page
    const previousButton = screen.getByRole('button', { name: /Previous/i });
    fireEvent.click(previousButton);

    // Check if back on the first page
    await waitFor(() => {
      expect(screen.queryByText(/Photo Title 5/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Photo Title 1/i)).toBeInTheDocument();
    });
  });

  /**
   * Test to ensure an error message is displayed when photo fetching fails.
   */
  it('should show error message when photos fail to load', async () => {
    // Mock a server error to test error handling
    mockAxios.onGet('https://jsonplaceholder.typicode.com/photos').reply(500);

    render(
      <RouterProvider 
        router={createBrowserRouter([
          {
            path: '/',
            element: <PhotosPage />
          }
        ], {
          future: {
            v7_startTransition: true,
          },
        })}
      />
    );

    // Wait for the error message to appear
    await waitFor(() => expect(screen.getByText('Failed to fetch photos.')).toBeInTheDocument());
  });

  /**
   * Test to check if the "No photos found" message appears when search yields no results.
   */
  it('should show "No photos found." message when no photos match the search', async () => {
    const mockData = [
      {
        albumId: 1,
        id: 1,
        title: 'accusamus beatae ad facilis cum similique qui sunt',
        url: 'https://via.placeholder.com/600/92c952',
        thumbnailUrl: 'https://via.placeholder.com/150/92c952'
      }
    ];

    // Mock data with only one photo to ensure no match on search
    mockAxios.onGet('https://jsonplaceholder.typicode.com/photos').reply(200, mockData);

    render(
      <RouterProvider 
        router={createBrowserRouter([
          {
            path: '/',
            element: <PhotosPage />
          }
        ], {
          future: {
            v7_startTransition: true,
          },
        })}
      />
    );

    await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeInTheDocument());

    // Search for a term that would yield no results
    const searchInput = screen.getByPlaceholderText('Search by title or ID...');
    fireEvent.change(searchInput, { target: { value: 'NonExistent' } });

    // Check for the "No photos found" message
    await waitFor(() => expect(screen.getByText('No photos found.')).toBeInTheDocument());
  });
});