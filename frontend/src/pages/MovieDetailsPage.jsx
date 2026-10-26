import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/movies/${id}`);
      if (res.data.success) {
        const movieData = res.data.data;
        setMovie(movieData);

        // Pre-select the first available date if showtimes exist
        if (movieData.showtimes && movieData.showtimes.length > 0) {
          setSelectedDate(movieData.showtimes[0].date);
        }
      }
    } catch (err) {
      console.error('Error fetching movie details:', err);
      setError(
        err.response?.data?.message || 'Failed to load movie details. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-warning my-5" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger my-4 p-4 rounded-4" role="alert">
          <i className="bi bi-exclamation-octagon fs-1 text-danger d-block mb-2"></i>
          <h4>Error Loading Movie</h4>
          <p>{error || 'Movie not found.'}</p>
          <Link to="/" className="btn btn-outline-light rounded-pill px-4 mt-2">
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  // Extract unique showtime dates
  const availableDates = Array.from(
    new Set((movie.showtimes || []).map((st) => st.date))
  ).sort();

  // Filter showtimes for currently selected date
  const filteredShowtimes = (movie.showtimes || []).filter(
    (st) => st.date === selectedDate
  );

  return (
    <div>
      {/* Movie Hero Banner with Backdrop */}
      <section
        className="py-5"
        style={{
          background: `linear-gradient(180deg, rgba(11, 14, 20, 0.75) 0%, rgba(11, 14, 20, 1) 100%), url(${
            movie.bannerUrl || movie.posterUrl
          }) center/cover no-repeat`,
          borderBottom: '1px solid var(--im-border-color)'
        }}
      >
        <div className="container py-3">
          <div className="row g-4 align-items-center">
            {/* Poster Thumbnail */}
            <div className="col-12 col-md-4 col-lg-3 text-center">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="img-fluid rounded-4 shadow-lg border border-secondary border-opacity-50"
                style={{ maxHeight: '420px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80';
                }}
              />
            </div>

            {/* Movie Info */}
            <div className="col-12 col-md-8 col-lg-9">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-warning text-dark fw-bold px-3 py-2 rounded-pill">
                  <i className="bi bi-star-fill me-1"></i>
                  {movie.rating ? movie.rating.toFixed(1) : '8.5'} / 10
                </span>
                <span className="badge bg-secondary px-3 py-2 rounded-pill">
                  {movie.language || 'English'}
                </span>
                <span className="badge bg-secondary px-3 py-2 rounded-pill">
                  <i className="bi bi-clock me-1"></i>
                  {movie.duration} Minutes
                </span>
              </div>

              <h1 className="display-4 fw-extrabold text-light mb-3">{movie.title}</h1>

              {/* Genres */}
              <div className="d-flex flex-wrap gap-2 mb-3">
                {movie.genre &&
                  movie.genre.map((g, idx) => (
                    <span
                      key={idx}
                      className="badge bg-dark bg-opacity-75 border border-secondary text-light px-3 py-2 rounded-pill"
                    >
                      {g}
                    </span>
                  ))}
              </div>

              {/* Synopsis */}
              <p className="lead text-light text-opacity-75 mb-4" style={{ maxWidth: '850px' }}>
                {movie.description}
              </p>

              {/* Cast & Director */}
              <div className="row text-secondary small pt-3 border-top border-secondary border-opacity-25">
                <div className="col-sm-6 mb-2">
                  <strong className="text-light d-block mb-1">Director:</strong>
                  <span>{movie.director || 'N/A'}</span>
                </div>
                <div className="col-sm-6 mb-2">
                  <strong className="text-light d-block mb-1">Starring:</strong>
                  <span>{movie.cast && movie.cast.length > 0 ? movie.cast.join(', ') : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showtimes & Booking Section */}
      <div className="container py-5">
        <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom border-secondary border-opacity-25">
          <div>
            <h3 className="fw-bold text-light mb-1">
              <i className="bi bi-calendar-event me-2 text-warning"></i> Available Showtimes
            </h3>
            <p className="text-secondary small mb-0">Select your preferred date and screen slot</p>
          </div>
          <Link to="/" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
            <i className="bi bi-arrow-left me-1"></i> Back to Catalog
          </Link>
        </div>

        {availableDates.length > 0 ? (
          <div>
            {/* Date Selection Pills */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              {availableDates.map((dateStr) => {
                const dateObj = new Date(dateStr + 'T00:00:00');
                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
                const dayNum = dateObj.getDate();

                const isSelected = selectedDate === dateStr;

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`btn px-4 py-2 rounded-3 text-start transition ${
                      isSelected
                        ? 'btn-cinema-gold fw-bold shadow'
                        : 'btn-outline-secondary text-light'
                    }`}
                  >
                    <div className="small text-uppercase" style={{ fontSize: '0.72rem' }}>
                      {dayName}
                    </div>
                    <div className="fs-5 fw-bold">
                      {monthName} {dayNum}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Showtime Slots Grid */}
            <div className="row g-3">
              {filteredShowtimes.map((st) => {
                const availableSeatsCount =
                  (st.totalSeats || 60) - (st.bookedSeats ? st.bookedSeats.length : 0);

                return (
                  <div key={st._id} className="col-12 col-md-6 col-lg-4">
                    <div className="p-4 rounded-4 cinema-card h-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge bg-secondary bg-opacity-50 text-warning px-2 py-1 rounded">
                            <i className="bi bi-geo-alt me-1"></i>
                            {st.theater}
                          </span>
                          <span className="text-success small fw-semibold">
                            <i className="bi bi-check-circle me-1"></i>
                            {availableSeatsCount} seats left
                          </span>
                        </div>

                        <div className="d-flex align-items-baseline gap-2 mb-2">
                          <h4 className="fw-bold text-light mb-0">{st.time}</h4>
                          <span className="text-secondary small">Standard Screen</span>
                        </div>
                      </div>

                      <div className="pt-3 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center mt-3">
                        <div>
                          <span className="text-secondary small d-block">Price / Seat</span>
                          <span className="fs-5 fw-bold text-light">₹{st.price}</span>
                        </div>
                        <button
                          onClick={() => navigate(`/booking/${st._id}`)}
                          className="btn btn-cinema rounded-pill px-4"
                        >
                          Select Seats <i className="bi bi-arrow-right ms-1"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-5 bg-dark bg-opacity-50 rounded-4 p-4 border border-secondary border-opacity-25">
            <i className="bi bi-calendar-x fs-1 text-secondary mb-2 d-block"></i>
            <h5>No Showtimes Currently Scheduled</h5>
            <p className="text-secondary small">
              Please check back later or run the database seeder to generate upcoming showtimes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailsPage;
