import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JadwalCard from '../JadwalCard';
import './JadwalSection.css';

function JadwalSection() {
  const navigate = useNavigate();
  const [jadwalData, setJadwalData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodaySchedules = async () => {
      try {
        const base = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
        const today = new Date().toISOString().split('T')[0];
        
        // Fetch schedules from MongoDB
        const res = await fetch(`${base}/jadwal`);
        
        if (res.ok) {
          const schedules = await res.json();
          
          // Filter schedules for today first
          let filteredSchedules = schedules.filter(schedule => 
            schedule.date === today && 
            schedule.status === 'active' &&
            (schedule.availableSeats || schedule.kursi_tersedia) > 0
          );
          
          // If no today schedules, get upcoming schedules
          if (filteredSchedules.length === 0) {
            filteredSchedules = schedules.filter(schedule => 
              schedule.date >= today && 
              schedule.status === 'active' &&
              (schedule.availableSeats || schedule.kursi_tersedia) > 0
            );
          }
          
          // Transform and limit to 4
          const transformedSchedules = filteredSchedules
            .slice(0, 4)
            .map(schedule => ({
              id: schedule.id || schedule._id,
              tanggal: new Date(schedule.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' }),
              tahun: new Date(schedule.date).getFullYear().toString(),
              origin: schedule.origin,
              destination: schedule.destination,
              rute: [schedule.origin, schedule.destination],
              harga: schedule.price || schedule.harga,
              diskon: 15,
              date: schedule.date,
              time: schedule.time
            }));
          
          setJadwalData(transformedSchedules);
        }
      } catch (error) {
        console.error('Error fetching schedules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodaySchedules();
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

  // Show loading state
  if (loading) {
    return (
      <section className="jadwal-section">
        <div className="jadwal-container">
          <h2 className="section-title">Jadwal Tersedia Hari Ini</h2>
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            Memuat jadwal...
          </p>
        </div>
      </section>
    );
  }

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
