import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in both email and password');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      navigate(redirectPath);
    } else {
      setError(result.message);
    }
  };

  const handleFillDemo = () => {
    setFormData({
      email: 'demo@imovies.com',
      password: 'password123'
    });
    setError(null);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="cinema-card p-4 p-md-5">
            <div className="text-center mb-4">
              <span className="fs-1">🍿</span>
              <h3 className="fw-bold text-light mt-2 mb-1">Welcome Back</h3>
              <p className="text-secondary small">
                Sign in to book tickets and manage your reservations
              </p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 rounded-3 small mb-4" role="alert">
                <i className="bi bi-exclamation-circle me-1"></i> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-secondary small fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    className="form-control bg-dark text-light border-secondary"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-secondary small fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    name="password"
                    className="form-control bg-dark text-light border-secondary"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-cinema-gold w-100 py-2 rounded-pill fw-bold mb-3 shadow"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Demo Fill Helper */}
              <button
                type="button"
                onClick={handleFillDemo}
                className="btn btn-outline-secondary btn-sm w-100 rounded-pill mb-3"
              >
                <i className="bi bi-magic me-1 text-warning"></i> Auto-fill Demo Account (demo@imovies.com)
              </button>

              <div className="text-center pt-3 border-top border-secondary border-opacity-25">
                <span className="text-secondary small">Don't have an account yet? </span>
                <Link
                  to={`/register?redirect=${encodeURIComponent(redirectPath)}`}
                  className="text-warning small fw-bold text-decoration-none"
                >
                  Create Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
