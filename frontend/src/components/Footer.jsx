import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-custom mt-auto py-4">
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-12 col-md-6 text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
              <span className="fs-4">🍿</span>
              <span className="fs-5 brand-text">IMovies</span>
            </div>
            <p className="text-secondary small mb-0">
              Full-Stack Movie Ticket Booking System • Built for SmartBridge MERN Stack Course
            </p>
          </div>

          <div className="col-12 col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3 small text-secondary mb-1">
              <Link to="/" className="text-secondary text-decoration-none">
                Movies
              </Link>
              <span>•</span>
              <Link to="/my-bookings" className="text-secondary text-decoration-none">
                My Bookings
              </Link>
              <span>•</span>
              <Link to="/login" className="text-secondary text-decoration-none">
                Sign In
              </Link>
            </div>
            <span className="small text-secondary text-opacity-50">
              © {new Date().getFullYear()} IMovies Cinema Platform. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
