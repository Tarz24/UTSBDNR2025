import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JadwalCard from '../JadwalCard';
import { getAllSchedules } from '../../../utils/dataManager';
import './JadwalSection.css';

function JadwalSection() {
  const navigate = useNavigate();
  const [jadwalData, setJadwalData] = useState([]);

  useEffect(() => {
    // Get schedules from localStorage
    const schedules = getAllSchedules();
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Filter schedules for today and active status, limit to 4
    const todaySchedules = schedules
      .filter(schedule => 
        schedule.date === today && 
        schedule.status === 'active' &&
        schedule.availableSeats > 0
      )
      .slice(0, 4)
      .map(schedule => ({
        id: schedule.id,
        tanggal: new Date(schedule.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' }),
        tahun: new Date(schedule.date).getFullYear().toString(),
        origin: schedule.origin,
        destination: schedule.destination,
        rute: [schedule.origin, schedule.destination],
        harga: schedule.price,
        diskon: 15, // Default discount
        date: schedule.date,
        time: schedule.time
      }));
    
    setJadwalData(todaySchedules);
  }, []);

  const handleJadwalClick = (jadwal) => {
    // Navigate ke SearchPage dengan pre-filled data
    // Gunakan format lengkap origin dan destination agar match dengan localStorage
    navigate('/search', { 
      state: { 
        searchParams: {
          berangkatDari: jadwal.origin,
          tujuanKe: jadwal.destination,
          tanggalPergi: jadwal.date,
          penumpang: 1,
          isPulangPergi: false
        }
      } 
    });
  };

  // Show message if no schedules available
  if (jadwalData.length === 0) {
    return (
      <section className="jadwal-section">
        <div className="jadwal-container">
          <h2 className="section-title">Jadwal Tersedia Hari Ini</h2>
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            Tidak ada jadwal tersedia untuk hari ini.
          </p>
        </div>
      </section>
    );
  }

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
              onClick={() => handleJadwalClick(jadwal)}
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
