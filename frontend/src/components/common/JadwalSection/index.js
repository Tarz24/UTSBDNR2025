import React from 'react';
import JadwalCard from '../JadwalCard';
import './JadwalSection.css';

function JadwalSection() {
  const jadwalData = [
    {
      tanggal: "17 November",
      tahun: "2025",
      rute: ["BANDUNG, PASTEUR2", "JAKARTA SELATAN, TEBET"],
      harga: 113000,
      diskon: 15
    },
    {
      tanggal: "17 November",
      tahun: "2025",
      rute: ["BANDUNG, PASTEUR2", "JAKARTA PUSAT, SARINAH"],
      harga: 113000,
      diskon: 15
    },
    {
      tanggal: "17 November",
      tahun: "2025",
      rute: ["PURWAKARTA, KM72B", "JAKARTA SELATAN, KUNINGAN"],
      harga: 50000,
      diskon: 15
    },
    {
      tanggal: "17 November",
      tahun: "2025",
      rute: ["PURWAKARTA, KM72B", "JAKARTA SELATAN, TEBET"],
      harga: 50000,
      diskon: 15
    }
  ];

  return (
    <section className="jadwal-section">
      <div className="jadwal-container">
        <h2 className="section-title">Jadwal Tersedia Hari Ini</h2>
        
        <div className="jadwal-carousel">
          {jadwalData.map((jadwal, index) => (
            <JadwalCard 
              key={index}
              tanggal={jadwal.tanggal}
              tahun={jadwal.tahun}
              rute={jadwal.rute}
              harga={jadwal.harga}
              diskon={jadwal.diskon}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="carousel-navigation">
          <button className="carousel-btn prev">❮</button>
          <button className="carousel-btn next">❯</button>
        </div>
      </div>
    </section>
  );
}

export default JadwalSection;
