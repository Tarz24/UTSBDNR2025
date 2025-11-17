import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import HeroSection from '../../components/common/HeroSection';
import JadwalSection from '../../components/common/JadwalSection';
import WhatsAppButton from '../../components/common/WhatsAppButton';
import Footer from '../../components/common/Footer';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const handleSearch = (formData) => {
    console.log('Searching with:', formData);
    // Navigate ke SearchPage dengan data pencarian
    navigate('/search', { state: { searchParams: formData } });
  };

  return (
    <div className="home-page">
      <Navbar />
      <HeroSection 
        title="Pesan Tiket Murah Jakarta Bandung !"
        onSearch={handleSearch}
      />
      <JadwalSection />
      <WhatsAppButton 
        phoneNumber="6281234567890"
        text="Tanya Pamela"
      />
      <Footer />
    </div>
  );
}

export default HomePage;
