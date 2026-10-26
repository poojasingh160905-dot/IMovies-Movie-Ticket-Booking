import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyBookingsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/my-bookings');
      return;
    }
    fetchMyBookings();
  }, [isAuthenticated]);

  const fetchMyBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/bookings/my-bookings');
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(
        err.response?.data?.message || 'Failed to retrieve your reservations.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (
      !window.confirm(
        'Are you sure you want to cancel this booking? Reserved seats will be released back into the theater seat map.'
      )
    ) {
      return;
    }

    setCancellingId(bookingId);
    setActionMessage(null);

    try {
      const res = await api.put(`/bookings/${bookingId}/cancel`);
      if (res.data.success) {
        setActionMessage({
          type: 'success',
          text: 'Booking cancelled successfully. Your seats have been released.'
        });
        // Update local state without full reload
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: 'CANCELLED' } : b))
        );
      }
    } catch (err) {
      console.error('Cancellation failed:', err);
      setActionMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to cancel the booking. Please try again.'
      });
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-warning my-5" role="status">
          <span className="visually-hidden">Loading reservations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Page Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-25">
        <div>
          <h2 className="fw-bold text-light mb-1">
            <i className="bi bi-ticket-perforated me-2 text-danger"></i> My Reservations
          </h2>
          <p className="text-secondary small mb-0">
            Manage your booked movie tickets and seat allocations ({bookings.length} reservations found)
          </p>
        </div>
        <Link to="/" className="btn btn-cinema-gold btn-sm rounded-pill px-3 mt-2 mt-md-0">
          <i className="bi bi-plus-circle me-1"></i> Book New Tickets
        </Link>
      </div>

      {/* Action Notification Message */}
      {actionMessage && (
        <div
          className={`alert alert-${actionMessage.type} alert-dismissible fade show rounded-3 mb-4`}
          role="alert"
        >
          <i className={`bi bi-${actionMessage.type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`}></i>
          {actionMessage.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => setActionMessage(null)}
          ></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger rounded-3 mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
        </div>
      )}

      {/* Bookings List */}
      {bookings.length > 0 ? (
        <div className="d-flex flex-column gap-3">
          {bookings.map((booking) => {
            const isCancelled = booking.status === 'CANCELLED';
            const movie = booking.movie || {};
            const showtime = booking.showtime || {};

            return (
              <div
                key={booking._id}
                className="cinema-card p-3 p-md-4 position-relative"
                style={{
                  opacity: isCancelled ? 0.75 : 1,
                  borderLeft: isCancelled ? '4px solid #dc3545' : '4px solid #28a745'
                }}
              >
                <div className="row g-3 align-items-center">
                  {/* Poster Thumbnail */}
                  <div className="col-4 col-sm-3 col-md-2 col-lg-1 text-center">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="img-fluid rounded-3 shadow-sm"
                      style={{ maxHeight: '110px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>

                  {/* Booking Core Details */}
                  <div className="col-8 col-sm-9 col-md-6 col-lg-7">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="badge bg-secondary bg-opacity-50 text-warning px-2 py-1 rounded small">
                        ID: {booking.bookingId}
                      </span>
                      <span
                        className={`badge rounded-pill px-3 py-1 ${
                          isCancelled ? 'bg-danger text-light' : 'bg-success text-light'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <h5 className="fw-bold text-light mb-1">{movie.title || 'Movie'}</h5>

                    <div className="text-secondary small mb-2">
                      <i className="bi bi-geo-alt me-1 text-warning"></i>
                      {showtime.theater || 'Main Auditorium'} •{' '}
                      <i className="bi bi-calendar-event me-1 text-info"></i>
                      {showtime.date || 'Scheduled Date'} at {showtime.time || 'Time'}
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <span className="small text-secondary">Seats:</span>
                      <div className="d-flex flex-wrap gap-1">
                        {booking.seats?.map((seat) => (
                          <span
                            key={seat}
                            className={`badge px-2 py-1 rounded ${
                              isCancelled
                                ? 'bg-secondary text-secondary text-decoration-line-through'
                                : 'bg-warning text-dark fw-bold'
                            }`}
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="col-12 col-md-4 col-lg-4 text-md-end pt-3 pt-md-0 border-top border-md-top-0 border-secondary border-opacity-25">
                    <div className="mb-2">
                      <span className="text-secondary small d-block">Amount</span>
                      <span className="fs-4 fw-bold text-light">₹{booking.totalPrice}</span>
                      <span className="text-secondary small d-block">
                        ({booking.seatCount} {booking.seatCount === 1 ? 'ticket' : 'tickets'})
                      </span>
                    </div>

                    {!isCancelled ? (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="btn btn-outline-danger btn-sm rounded-pill px-3 mt-1"
                      >
                        {cancellingId === booking._id ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-x-circle me-1"></i> Cancel Booking
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="badge bg-secondary bg-opacity-25 text-secondary px-3 py-2 rounded-pill small">
                        Seats Released
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-5 cinema-card p-5">
          <i className="bi bi-ticket fs-1 text-secondary mb-3 d-block"></i>
          <h4 className="fw-bold text-light">No Bookings Found</h4>
          <p className="text-secondary mb-4" style={{ maxWidth: '450px', margin: '0 auto' }}>
            You haven't made any cinema reservations yet. Explore our current catalog to book tickets for upcoming blockbusters!
          </p>
          <Link to="/" className="btn btn-cinema rounded-pill px-4">
            <i className="bi bi-film me-1"></i> Browse Movies
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
