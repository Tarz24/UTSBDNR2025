import React from 'react';
import SearchForm from '../../search/SearchForm';
import './HeroSection.css';

function HeroSection({ title, onSearch }) {
  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">{title || "Pesan Tiket Murah Jakarta Bandung !"}</h1>
        <SearchForm onSearch={onSearch} />
      </div>
    </section>
  );
}

export default HeroSection;
