import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './style.css'; 

const AlbumsPage = () => {
  const [albums, setAlbums] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(''); 

  const [currentPage, setCurrentPage] = useState(1); 
  const albumsPerPage = 10; 
  const [searchQuery, setSearchQuery] = useState(''); 

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/albums');
        setAlbums(response.data); 
      } catch (err) {
        setError('Failed to fetch albums.');
      } finally {
        setLoading(false); 
      }
    };
    fetchAlbums();
  }, []); 

  if (loading) return <p>Loading albums...</p>; 
  if (error) return <p style={{ color: 'red' }}>{error}</p>; 

  // Pagination logic
  const indexOfLastAlbum = currentPage * albumsPerPage; 
  const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage; 
  const currentAlbums = albums.slice(indexOfFirstAlbum, indexOfLastAlbum); 
  const totalPages = Math.ceil(albums.length / albumsPerPage); 

  // Filter albums based on the search query (by title or ID)
  const filteredAlbums = currentAlbums.filter(album => 
    album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    album.id.toString().includes(searchQuery) 
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1); 
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <h2>Albums List</h2>
      <p>
        <Link to="/home">Go Back to Home</Link>
      </p>

      {/* Search input */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search albums by title or ID..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          style={{ padding: '10px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }} 
        />
      </div>

      {/* List of albums */}
      <ul>
        {filteredAlbums.length > 0 ? (
          filteredAlbums.map((album) => (
            <li key={album.id} className="album-item">
              {/* Link to photos page for this album */}
              <strong>
                <Link to={`/photos/${album.id}`}>{album.title}</Link>
              </strong> 
              (Album ID: {album.id})
            </li>
          ))
        ) : (
          <p>No albums found.</p>
        )}
      </ul>

      {/* Pagination */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default AlbumsPage;