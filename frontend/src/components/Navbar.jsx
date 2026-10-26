import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [navSearch, setNavSearch] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/?search=${encodeURIComponent(navSearch.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span className="fs-3">🍿</span>
          <span className="fs-4 brand-text">IMovies</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-secondary text-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list fs-2 text-light"></i>
        </button>

        {/* Collapsible Content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Search form in navbar */}
          <form className="d-flex mx-lg-auto my-3 my-lg-0 w-100" style={{ maxWidth: '420px' }} onSubmit={handleSearchSubmit}>
            <div className="input-group">
              <span className="input-group-text bg-secondary border-secondary text-light">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                placeholder="Search movies, actors, genres..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
              />
              {navSearch && (
                <button
                  type="button"
                  className="btn btn-dark border-secondary text-secondary"
                  onClick={() => {
                    setNavSearch('');
                    navigate('/');
                  }}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </form>

          {/* Navigation Links & User Menu */}
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
            <li className="nav-item">
              <Link className="nav-link text-light fw-medium px-2" to="/">
                <i className="bi bi-film me-1 text-warning"></i> Movies
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-light fw-medium px-2" to="/my-bookings">
                    <i className="bi bi-ticket-perforated me-1 text-danger"></i> My Bookings
                  </Link>
                </li>
                <li className="nav-item dropdown ms-lg-2">
                  <div className="d-flex align-items-center gap-2 py-1">
                    <span className="badge bg-secondary p-2 d-flex align-items-center gap-1 rounded-pill">
                      <i className="bi bi-person-circle fs-6 text-warning"></i>
                      <span className="text-light fw-semibold px-1">{user?.name || 'User'}</span>
                    </span>
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline-danger btn-sm rounded-pill px-3"
                      title="Log Out"
                    >
                      <i className="bi bi-box-arrow-right me-1"></i> Logout
                    </button>
                  </div>
                </li>
              </>
            ) : (
              <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
                <Link to="/login" className="btn btn-outline-light btn-sm px-3 rounded-pill">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-cinema btn-sm px-3 rounded-pill">
                  Register
                </Link>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
