import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import MovieCard from '../components/MovieCard';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Adventure', 'Drama', 'Crime', 'Biography'];

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedGenre = searchParams.get('genre') || 'All';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchMovies();
  }, [selectedGenre, searchQuery]);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = '/movies';
      const params = {};
      if (selectedGenre && selectedGenre !== 'All') {
        params.genre = selectedGenre;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }

      const res = await api.get(endpoint, { params });
      if (res.data.success) {
        setMovies(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError(
        err.response?.data?.message ||
          'Failed to load movies. Please ensure backend server and database are running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenreClick = (genre) => {
    const newParams = new URLSearchParams(searchParams);
    if (genre === 'All') {
      newParams.delete('genre');
    } else {
      newParams.set('genre', genre);
    }
    setSearchParams(newParams);
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="container text-center py-4">
          <span className="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50 px-3 py-2 rounded-pill mb-3">
            <i className="bi bi-ticket-detailed me-1"></i> Instant Cinema Reservations
          </span>
          <h1 className="display-4 fw-extrabold text-light mb-3">
            Book Tickets For The Latest <span className="brand-text">Blockbusters</span>
          </h1>
          <p className="lead text-secondary mx-auto mb-4" style={{ maxWidth: '650px' }}>
            Experience the magic of cinema with seamless real-time seat selection, interactive screen layouts, and instant digital booking confirmations.
          </p>

          {/* Quick Stats or Tagline */}
          <div className="d-flex justify-content-center gap-4 text-secondary small">
            <div><i className="bi bi-shield-check text-warning me-1"></i> Concurrency-Safe Booking</div>
            <div><i className="bi bi-lightning-charge text-danger me-1"></i> Instant Seat Locking</div>
            <div><i className="bi bi-arrow-counterclockwise text-info me-1"></i> Instant Cancellation</div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container py-5">
        {/* Search & Genre Filter Bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h3 className="fw-bold text-light mb-1">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Now Showing in Theaters'}
            </h3>
            <p className="text-secondary small mb-0">
              Showing {movies.length} movies available for online booking
            </p>
          </div>

          {/* Genre Filter Tabs */}
          <div className="d-flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreClick(genre)}
                className={`btn btn-sm rounded-pill px-3 transition ${
                  selectedGenre === genre
                    ? 'btn-cinema-gold fw-bold'
                    : 'btn-outline-secondary text-light'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading movies...</span>
            </div>
            <p className="text-secondary mt-3">Fetching current movie catalog...</p>
          </div>
        )}

        {/* Error Alert */}
        {error && !loading && (
          <div className="alert alert-danger d-flex align-items-center gap-3 rounded-3 my-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill fs-3"></i>
            <div>
              <h6 className="alert-heading fw-bold mb-1">Database Connection Notice</h6>
              <p className="mb-0 small">{error}</p>
              <div className="mt-2">
                <button onClick={fetchMovies} className="btn btn-outline-danger btn-sm rounded-pill">
                  <i className="bi bi-arrow-clockwise me-1"></i> Retry Loading
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && !error && movies.length > 0 && (
          <div className="row g-4">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && movies.length === 0 && (
          <div className="text-center py-5 bg-dark bg-opacity-50 rounded-4 border border-secondary border-opacity-25 p-5">
            <i className="bi bi-film fs-1 text-secondary mb-3 d-block"></i>
            <h4 className="fw-bold text-light">No Movies Found</h4>
            <p className="text-secondary">
              No movie matches your selected filters or search query. Try choosing another genre or clearing the search.
            </p>
            <button
              onClick={() => {
                setSearchParams({});
              }}
              className="btn btn-outline-warning rounded-pill px-4 mt-2"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
