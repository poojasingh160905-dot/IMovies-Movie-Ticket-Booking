import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SeatMap from '../components/SeatMap';

const SeatSelectionPage = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    fetchShowtime();
  }, [showtimeId]);

  const fetchShowtime = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/showtimes/${showtimeId}`);
      if (res.data.success) {
        setShowtime(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching showtime:', err);
      setError(
        err.response?.data?.message || 'Failed to load showtime details.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSeatToggle = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= 8) {
        alert('You can select a maximum of 8 seats per booking transaction.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBookingSubmit = async () => {
    if (!isAuthenticated) {
      // Redirect to login with return path
      navigate('/login?redirect=' + encodeURIComponent(`/booking/${showtimeId}`));
      return;
    }

    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to proceed.');
      return;
    }

    setBookingLoading(true);
    setError(null);

    try {
      const res = await api.post('/bookings', {
        showtimeId,
        seats: selectedSeats
      });

      if (res.data.success) {
        setConfirmedBooking(res.data.data);
        setSelectedSeats([]);
      }
    } catch (err) {
      console.error('Booking failed:', err);
      const errorMsg =
        err.response?.data?.message ||
        'Booking transaction failed. Please choose different seats or try again.';
      setError(errorMsg);

      // If seats were already taken (HTTP 409 Conflict), refresh showtime seat state immediately
      if (err.response?.status === 409) {
        fetchShowtime();
        // Remove conflicting seats from current selection
        if (err.response?.data?.conflictingSeats) {
          const conflicting = err.response.data.conflictingSeats;
          setSelectedSeats((prev) => prev.filter((s) => !conflicting.includes(s)));
        }
      }
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-warning my-5" role="status">
          <span className="visually-hidden">Loading seat layout...</span>
        </div>
      </div>
    );
  }

  if (error && !showtime) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger my-4 p-4 rounded-4">
          <i className="bi bi-exclamation-triangle-fill fs-1 text-danger d-block mb-2"></i>
          <h4>Unable to Load Seat Map</h4>
          <p>{error}</p>
          <Link to="/" className="btn btn-outline-light rounded-pill px-4 mt-2">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const movie = showtime?.movie || {};
  const ticketPrice = showtime?.price || 250;
  const totalPrice = selectedSeats.length * ticketPrice;

  return (
    <div className="container py-4">
      {/* Header Breadcrumb */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-3 border-bottom border-secondary border-opacity-25">
        <div>
          <span className="text-secondary small">
            <Link to="/" className="text-secondary text-decoration-none">
              Home
            </Link>{' '}
            / <Link to={`/movie/${movie._id}`} className="text-secondary text-decoration-none">{movie.title}</Link> / Seat Selection
          </span>
          <h2 className="fw-bold text-light mt-1 mb-0">{movie.title}</h2>
          <div className="text-secondary small mt-1">
            <span className="text-warning fw-semibold">{showtime.theater}</span> •{' '}
            <span>{showtime.date}</span> • <span>{showtime.time}</span>
          </div>
        </div>
        <Link
          to={`/movie/${movie._id}`}
          className="btn btn-outline-secondary btn-sm rounded-pill px-3 mt-2 mt-md-0"
        >
          <i className="bi bi-arrow-left me-1"></i> Change Showtime
        </Link>
      </div>

      {/* Concurrency / Double Booking Error Notice */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show rounded-3 mb-4" role="alert">
          <i className="bi bi-shield-slash-fill me-2 fs-5"></i>
          <strong>Reservation Alert:</strong> {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      <div className="row g-4">
        {/* Left Column: Interactive Seat Map */}
        <div className="col-12 col-lg-8">
          <div className="cinema-card p-4">
            <SeatMap
              rows={showtime.rows || 6}
              cols={showtime.cols || 10}
              bookedSeats={showtime.bookedSeats || []}
              selectedSeats={selectedSeats}
              onSeatToggle={handleSeatToggle}
              maxSeats={8}
            />
          </div>
        </div>

        {/* Right Column: Booking Summary & Checkout */}
        <div className="col-12 col-lg-4">
          <div className="cinema-card p-4 position-sticky" style={{ top: '90px' }}>
            <h4 className="fw-bold text-light mb-3 pb-2 border-bottom border-secondary border-opacity-25">
              <i className="bi bi-receipt me-2 text-warning"></i> Booking Summary
            </h4>

            {/* Movie Poster & Title Card */}
            <div className="d-flex gap-3 mb-3">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="rounded-3 shadow-sm"
                style={{ width: '65px', height: '90px', objectFit: 'cover' }}
              />
              <div>
                <h6 className="fw-bold text-light mb-1">{movie.title}</h6>
                <div className="text-secondary small">{movie.duration} mins • {movie.language}</div>
                <div className="text-warning small mt-1">
                  <i className="bi bi-clock me-1"></i> {showtime.time}
                </div>
              </div>
            </div>

            {/* Selected Seats List */}
            <div className="mb-3">
              <label className="text-secondary small d-block mb-1">Selected Seats:</label>
              {selectedSeats.length > 0 ? (
                <div className="d-flex flex-wrap gap-1">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat}
                      className="badge bg-warning text-dark fw-bold px-2 py-1 rounded"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-secondary small fst-italic">No seats selected yet</span>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="pt-3 border-top border-secondary border-opacity-25">
              <div className="d-flex justify-content-between text-secondary small mb-2">
                <span>Tickets ({selectedSeats.length})</span>
                <span>₹{ticketPrice} × {selectedSeats.length}</span>
              </div>
              <div className="d-flex justify-content-between text-secondary small mb-2">
                <span>Convenience Fee</span>
                <span className="text-success">FREE</span>
              </div>
              <div className="d-flex justify-content-between text-light fw-bold fs-5 pt-2 border-top border-secondary border-opacity-25 mb-4">
                <span>Total Amount</span>
                <span className="text-warning">₹{totalPrice}</span>
              </div>
            </div>

            {/* Action Buttons */}
            {isAuthenticated ? (
              <button
                onClick={handleBookingSubmit}
                disabled={selectedSeats.length === 0 || bookingLoading}
                className="btn btn-cinema-gold w-100 py-3 rounded-pill fw-bold fs-6 shadow d-flex align-items-center justify-content-center gap-2"
              >
                {bookingLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Locking Seats & Confirming...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle fs-5"></i>
                    Confirm Booking (₹{totalPrice})
                  </>
                )}
              </button>
            ) : (
              <div className="text-center p-3 rounded-3 bg-dark border border-secondary border-opacity-25">
                <p className="small text-secondary mb-2">
                  Please log in to your IMovies account to finalize seat booking.
                </p>
                <Link
                  to={`/login?redirect=${encodeURIComponent(`/booking/${showtimeId}`)}`}
                  className="btn btn-cinema btn-sm w-100 rounded-pill"
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> Sign In to Book
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {confirmedBooking && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)' }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content bg-dark text-light border border-warning border-opacity-50 rounded-4 shadow-lg">
              <div className="modal-header border-bottom border-secondary border-opacity-25 text-center d-block position-relative pt-4">
                <div className="mx-auto mb-2 text-success">
                  <i className="bi bi-patch-check-fill display-3"></i>
                </div>
                <h4 className="modal-title fw-bold text-light">Booking Confirmed!</h4>
                <p className="text-secondary small mb-0">Your tickets have been reserved successfully</p>
              </div>

              <div className="modal-body p-4">
                {/* Booking ID Banner */}
                <div className="p-3 mb-3 rounded-3 bg-secondary bg-opacity-25 border border-warning border-opacity-50 text-center">
                  <div className="small text-uppercase text-secondary">Digital Ticket ID</div>
                  <div className="fs-4 fw-extrabold text-warning letter-spacing-1">
                    {confirmedBooking.bookingId}
                  </div>
                </div>

                <div className="row g-2 small text-secondary mb-3">
                  <div className="col-6">
                    <span className="d-block text-light fw-semibold">Movie:</span>
                    <span>{confirmedBooking.movie?.title || movie.title}</span>
                  </div>
                  <div className="col-6">
                    <span className="d-block text-light fw-semibold">Theater:</span>
                    <span>{confirmedBooking.showtime?.theater || showtime.theater}</span>
                  </div>
                  <div className="col-6 mt-2">
                    <span className="d-block text-light fw-semibold">Date & Time:</span>
                    <span>
                      {confirmedBooking.showtime?.date || showtime.date} at{' '}
                      {confirmedBooking.showtime?.time || showtime.time}
                    </span>
                  </div>
                  <div className="col-6 mt-2">
                    <span className="d-block text-light fw-semibold">Seats:</span>
                    <span className="text-warning fw-bold">
                      {confirmedBooking.seats?.join(', ')} ({confirmedBooking.seatCount} Seats)
                    </span>
                  </div>
                </div>

                <div className="d-flex justify-content-between p-3 rounded-3 bg-dark border border-secondary border-opacity-25">
                  <span className="text-light fw-bold">Total Paid:</span>
                  <span className="text-success fw-bold fs-5">₹{confirmedBooking.totalPrice}</span>
                </div>
              </div>

              <div className="modal-footer border-top border-secondary border-opacity-25 d-flex gap-2 p-3">
                <Link
                  to="/"
                  className="btn btn-outline-secondary flex-grow-1 rounded-pill"
                >
                  Book More Movies
                </Link>
                <Link
                  to="/my-bookings"
                  className="btn btn-cinema-gold flex-grow-1 rounded-pill fw-bold"
                >
                  <i className="bi bi-ticket-perforated me-1"></i> View My Bookings
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelectionPage;
