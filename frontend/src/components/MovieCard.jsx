import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
      <div className="cinema-card w-100 d-flex flex-column">
        {/* Poster Container */}
        <div className="poster-img-container">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="poster-img"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80';
            }}
          />
          {/* Rating Badge */}
          <div className="rating-badge">
            <i className="bi bi-star-fill text-warning"></i>
            <span>{movie.rating ? movie.rating.toFixed(1) : '8.5'}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3 d-flex flex-column flex-grow-1 justify-content-between">
          <div>
            {/* Title */}
            <h5 className="fw-bold text-light mb-1 text-truncate" title={movie.title}>
              {movie.title}
            </h5>

            {/* Quick Meta */}
            <div className="d-flex align-items-center gap-2 text-secondary small mb-2">
              <span><i className="bi bi-clock me-1"></i>{movie.duration} min</span>
              <span>•</span>
              <span>{movie.language || 'English'}</span>
            </div>

            {/* Genre Pills */}
            <div className="d-flex flex-wrap gap-1 mb-2">
              {movie.genre && movie.genre.slice(0, 3).map((g, idx) => (
                <span key={idx} className="genre-badge">
                  {g}
                </span>
              ))}
            </div>

            {/* Description Snippet */}
            <p className="text-secondary small mb-3 text-break" style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {movie.description}
            </p>
          </div>

          {/* Pricing & Booking CTA */}
          <div className="pt-2 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between mt-auto">
            <div>
              <span className="text-secondary small d-block" style={{ fontSize: '0.72rem' }}>Ticket from</span>
              <span className="fw-bold text-warning fs-6">₹{movie.basePrice || 250}</span>
            </div>
            <Link
              to={`/movie/${movie._id}`}
              className="btn btn-cinema btn-sm px-3 rounded-pill d-flex align-items-center gap-1"
            >
              <i className="bi bi-ticket-perforated"></i> Book
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
