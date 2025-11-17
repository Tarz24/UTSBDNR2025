import React from 'react';
import Navbar from '../../components/common/Navbar';
import HeroSection from '../../components/common/HeroSection';
import JadwalSection from '../../components/common/JadwalSection';
import WhatsAppButton from '../../components/common/WhatsAppButton';
import Footer from '../../components/common/Footer';
import './HomePage.css';

function HomePage() {
  const handleSearch = (formData) => {
    console.log('Searching with:', formData);
    // Nanti akan redirect ke SearchResultPage
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
