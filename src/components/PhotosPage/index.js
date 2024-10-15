import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './style.css';

const PhotosPage = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const photosPerPage = 4;
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/photos');
        setPhotos(response.data);
      } catch (err) {
        setError('Failed to fetch photos.');
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  if (loading) return <div className="loader-container" role="status" data-testid="loader"><div className="loader"></div></div>;
  if (error) return <div className="error-container"><p className="error-message">{error}</p></div>;

  const filteredPhotos = photos.filter(photo =>
    photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    photo.id.toString().includes(searchQuery)
  );

  const indexOfLastPhoto = currentPage * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
  const currentPhotos = filteredPhotos.slice(indexOfFirstPhoto, indexOfLastPhoto);

  const totalPages = Math.ceil(filteredPhotos.length / photosPerPage);

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
    <div className="photos-container">
      <h2 className="header-title">Photos List</h2>
      <p><Link to="/home" className="back-button">Go Back to Home</Link></p>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by title or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>


      <div className="photo-grid">
        {currentPhotos.length > 0 ? (
          currentPhotos.map((photo) => (
            <div key={photo.id} className="photo-card">
              <div className="image-container">
                <img src={photo.thumbnailUrl} alt={photo.title} />
              </div>
              <p className="photo-title">{photo.title}</p>
              <p className="photo-id">{photo.id}</p>
            </div>
          ))
        ) : (
          <p>No photos found.</p>
        )}
      </div>


      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1} className="pagination-button">
          Previous
        </button>
        <span className="pagination-info">Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-button">
          Next
        </button>
      </div>
    </div>
  );
};

export default PhotosPage;
