import React, { useState } from 'react';
import './RegisterPage.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    noHp: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

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
  };

  const validateForm = () => {
    const newErrors = {};

    // Validasi nama lengkap
    if (!formData.namaLengkap) {
      newErrors.namaLengkap = 'Nama lengkap wajib diisi';
    } else if (formData.namaLengkap.length < 3) {
      newErrors.namaLengkap = 'Nama minimal 3 karakter';
    }

    // Validasi email
    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Validasi no HP
    if (!formData.noHp) {
      newErrors.noHp = 'Nomor HP wajib diisi';
    } else if (!/^[0-9]{10,13}$/.test(formData.noHp)) {
      newErrors.noHp = 'Nomor HP tidak valid (10-13 digit)';
    }

    // Validasi password
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    // Validasi confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    // Validasi terms
    if (!acceptTerms) {
      newErrors.terms = 'Anda harus menyetujui syarat dan ketentuan';
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

    // Simulasi API call (nanti akan diganti dengan API real)
    setTimeout(() => {
      console.log('Register data:', {
        namaLengkap: formData.namaLengkap,
        email: formData.email,
        noHp: formData.noHp
      });
      alert('Pendaftaran berhasil! Silakan login dengan akun Anda.');
      setIsLoading(false);
      // Nanti akan navigate ke LoginPage
      // navigate('/login');
    }, 2000);
  };

  const handleLoginRedirect = () => {
    console.log('Navigate to LoginPage');
    // Nanti akan navigate ke LoginPage
    // navigate('/login');
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Left Side - Branding */}
        <div className="register-brand">
          <div className="brand-content">
            <div className="brand-logo">
              <h1>Baraya Travel</h1>
              <div className="brand-icon">🚌</div>
            </div>
            <h2>Bergabunglah Bersama Kami!</h2>
            <p>Daftar sekarang dan nikmati kemudahan booking tiket travel</p>
            <div className="brand-benefits">
              <div className="benefit-item">
                <span className="benefit-number">1</span>
                <div className="benefit-text">
                  <h4>Daftar Gratis</h4>
                  <p>Buat akun tanpa biaya apapun</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-number">2</span>
                <div className="benefit-text">
                  <h4>Booking Mudah</h4>
                  <p>Pesan tiket dalam hitungan menit</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-number">3</span>
                <div className="benefit-text">
                  <h4>Riwayat Lengkap</h4>
                  <p>Lihat semua perjalanan Anda</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="register-form-container">
          <div className="register-form-wrapper">
            <div className="form-header">
              <h2>Buat Akun</h2>
              <p>Lengkapi data diri Anda untuk mendaftar</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              {/* Nama Lengkap */}
              <div className="form-group">
                <label htmlFor="namaLengkap">Nama Lengkap</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    id="namaLengkap"
                    name="namaLengkap"
                    placeholder="Masukkan nama lengkap"
                    value={formData.namaLengkap}
                    onChange={handleChange}
                    className={errors.namaLengkap ? 'error' : ''}
                  />
                </div>
                {errors.namaLengkap && <span className="error-message">{errors.namaLengkap}</span>}
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
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

              {/* Nomor HP */}
              <div className="form-group">
                <label htmlFor="noHp">Nomor HP</label>
                <div className="input-wrapper">
                  <span className="input-icon">📱</span>
                  <input
                    type="tel"
                    id="noHp"
                    name="noHp"
                    placeholder="08123456789"
                    value={formData.noHp}
                    onChange={handleChange}
                    className={errors.noHp ? 'error' : ''}
                  />
                </div>
                {errors.noHp && <span className="error-message">{errors.noHp}</span>}
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Minimal 6 karakter"
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

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword">Konfirmasi Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Ulangi password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              {/* Terms & Conditions */}
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => {
                      setAcceptTerms(e.target.checked);
                      if (errors.terms) {
                        setErrors(prev => ({ ...prev, terms: '' }));
                      }
                    }}
                  />
                  <span className="checkbox-text">
                    Saya menyetujui{' '}
                    <button type="button" className="terms-link">
                      syarat dan ketentuan
                    </button>
                  </span>
                </label>
                {errors.terms && <span className="error-message">{errors.terms}</span>}
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
                  'Daftar Sekarang'
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="form-footer">
              <p>
                Sudah punya akun?{' '}
                <button
                  type="button"
                  className="login-link"
                  onClick={handleLoginRedirect}
                >
                  Masuk Disini
                </button>
              </p>
            </div>

            {/* Back to Home */}
            <div className="back-to-home">
              <button
                type="button"
                className="back-btn"
                onClick={() => console.log('Navigate to HomePage')}
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

export default RegisterPage;
