import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';
import './PhotosPage.css'; 

const PhotosPage = () => {
    const [photos, setPhotos] = useState([]); // Store photo data
    const [loading, setLoading] = useState(true); // Loading status
    const [error, setError] = useState(''); // Error messages
    const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
    const photosPerPage = 5; // Number of photos to display per page
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

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

    if (loading) return <p>Loading photos...</p>; 
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    // Pagination logic
    const indexOfLastPhoto = currentPage * photosPerPage; 
    const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage; 
    const currentPhotos = photos.slice(indexOfFirstPhoto, indexOfLastPhoto); 

    const totalPages = Math.ceil(photos.length / photosPerPage); 

    const filteredPhotos = currentPhotos.filter(photo => 
        photo.title.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className="container">
            <h2>Photos List</h2>
            <p>
                <Link to="/home">Go Back to Home</Link>
            </p>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <input 
                    type="text" 
                    placeholder="Search photos..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    style={{ padding: '10px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
            </div>

            <div className="photo-grid">
                {filteredPhotos.length > 0 ? (
                    filteredPhotos.map((photo) => (
                        <div key={photo.id} className="photo-card">
                            <img
                                src={photo.thumbnailUrl}
                                alt={photo.title}
                            />
                            <p>{photo.title}</p>
                        </div>
                    ))
                ) : (
                    <p>No photos found.</p>
                )}
            </div>

            <div className="button-container">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span style={{ margin: '0 10px' }}>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default PhotosPage;