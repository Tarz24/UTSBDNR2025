import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn } = useAuth();
  
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  // Redirect jika sudah login
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  // Clear success message setelah 5 detik
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error saat user mulai mengetik
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear login error
    if (loginError) {
      setLoginError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validasi email
    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Validasi password
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setLoginError('');

    // Gunakan AuthContext login
    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Login berhasil
      console.log('✅ Login successful!', result.user);
      
      // Tampilkan pesan sukses
      setTimeout(() => {
        setIsLoading(false);
        // Redirect berdasarkan role
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 500);
    } else {
      // Login gagal
      setIsLoading(false);
      setLoginError(result.message);
      console.error('❌ Login failed:', result.message);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  const handleForgotPassword = () => {
    alert('Fitur reset password akan segera tersedia!');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Branding */}
        <div className="login-brand">
          <div className="brand-content">
            <div className="brand-logo">
              <h1>Baraya Travel</h1>
              <div className="brand-icon">🚌</div>
            </div>
            <h2>Selamat Datang Kembali!</h2>
            <p>Masuk untuk melanjutkan perjalanan Anda bersama kami</p>
            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Booking Mudah & Cepat</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Harga Terjangkau</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Pembayaran Aman</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-container">
          <div className="login-form-wrapper">
            <div className="form-header">
              <h2>Masuk</h2>
              <p>Silakan masuk dengan akun Anda</p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="alert alert-success">
                <span className="alert-icon">✅</span>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Login Error Message */}
            {loginError && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              {/* Email Input */}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="contoh@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              {/* Password Input */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              {/* Forgot Password */}
              <div className="form-options">
                <button
                  type="button"
                  className="forgot-password-btn"
                  onClick={handleForgotPassword}
                >
                  Lupa Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Memproses...
                  </>
                ) : (
                  'Masuk'
                )}
              </button>
            </form>

            {/* Demo Accounts Info */}
            <div className="demo-info">
              <p className="demo-title">🔑 Demo Accounts:</p>
              <div className="demo-accounts">
                <div className="demo-account">
                  <strong>User:</strong> ahmad@email.com / password123
                </div>
                <div className="demo-account">
                  <strong>Admin:</strong> admin@baraya.com / admin123
                </div>
              </div>
            </div>

            {/* Register Link */}
            <div className="form-footer">
              <p>
                Belum punya akun?{' '}
                <button
                  type="button"
                  className="register-link"
                  onClick={handleRegisterRedirect}
                >
                  Daftar Sekarang
                </button>
              </p>
            </div>

            {/* Back to Home */}
            <div className="back-to-home">
              <button
                type="button"
                className="back-btn"
                onClick={handleBackToHome}
              >
                ← Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
