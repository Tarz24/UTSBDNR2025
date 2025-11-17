import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import './BookingChart.css';

const BookingChart = ({ bookings }) => {
  const [periodFilter, setPeriodFilter] = useState('week'); // week, month, year, all

  // Process data untuk chart - group by date with period filter
  const chartData = useMemo(() => {
    if (!bookings || bookings.length === 0) return [];

    // Filter bookings based on period
    const now = new Date();
    let filteredBookings = bookings;

    if (periodFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredBookings = bookings.filter(b => new Date(b.bookingDate) >= weekAgo);
    } else if (periodFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredBookings = bookings.filter(b => new Date(b.bookingDate) >= monthAgo);
    } else if (periodFilter === 'year') {
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      filteredBookings = bookings.filter(b => new Date(b.bookingDate) >= yearAgo);
    }
    // if 'all', use all bookings

    // Group bookings by date
    const groupedByDate = filteredBookings.reduce((acc, booking) => {
      let dateKey;
      const bookingDate = new Date(booking.bookingDate);
      
      // Format date based on period
      if (periodFilter === 'week') {
        dateKey = bookingDate.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short'
        });
      } else if (periodFilter === 'month') {
        dateKey = bookingDate.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short'
        });
      } else if (periodFilter === 'year') {
        dateKey = bookingDate.toLocaleDateString('id-ID', {
          month: 'short',
          year: 'numeric'
        });
      } else {
        dateKey = bookingDate.toLocaleDateString('id-ID', {
          month: 'short',
          year: 'numeric'
        });
      }
      
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          count: 0,
          revenue: 0,
          confirmed: 0,
          pending: 0,
          cancelled: 0,
          completed: 0
        };
      }
      
      acc[dateKey].count += 1;
      acc[dateKey].revenue += booking.totalPrice || 0;
      
      if (booking.status === 'confirmed') {
        acc[dateKey].confirmed += 1;
      } else if (booking.status === 'completed') {
        acc[dateKey].completed += 1;
      } else if (booking.status === 'pending') {
        acc[dateKey].pending += 1;
      } else if (booking.status === 'cancelled') {
        acc[dateKey].cancelled += 1;
      }
      
      return acc;
    }, {});

    // Convert to array and sort by date
    const dataArray = Object.values(groupedByDate).sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    return dataArray;
  }, [bookings, periodFilter]);

  // Calculate status distribution for pie chart
  const statusData = useMemo(() => {
    if (!bookings || bookings.length === 0) return [];

    const statusCount = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {});

    return [
      { name: 'Confirmed', value: statusCount.confirmed || 0, color: '#4CAF50' },
      { name: 'Completed', value: statusCount.completed || 0, color: '#2196F3' },
      { name: 'Pending', value: statusCount.pending || 0, color: '#FFC107' },
      { name: 'Cancelled', value: statusCount.cancelled || 0, color: '#F44336' }
    ].filter(item => item.value > 0);
  }, [bookings]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for revenue
  const RevenueTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          <p style={{ color: payload[0].color }}>
            {`Revenue: Rp ${payload[0].value.toLocaleString('id-ID')}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const getPeriodLabel = () => {
    switch (periodFilter) {
      case 'week': return 'Mingguan (7 Hari Terakhir)';
      case 'month': return 'Bulanan (30 Hari Terakhir)';
      case 'year': return 'Tahunan (12 Bulan Terakhir)';
      case 'all': return 'Keseluruhan';
      default: return 'Mingguan';
    }
  };

  if (chartData.length === 0) {
    return (
      <div className="booking-chart">
        <div className="chart-header">
          <h3>📊 Statistik Pemesanan</h3>
          <div className="period-filter">
            <label>Periode:</label>
            <select value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)}>
              <option value="week">Per Minggu</option>
              <option value="month">Per Bulan</option>
              <option value="year">Per Tahun</option>
              <option value="all">Keseluruhan</option>
            </select>
          </div>
        </div>
        <div className="chart-empty">
          <p>Belum ada data pemesanan untuk ditampilkan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-chart">
      <div className="chart-header">
        <h3>📊 Statistik Pemesanan - {getPeriodLabel()}</h3>
        <div className="period-filter">
          <label>Periode:</label>
          <select value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)}>
            <option value="week">Per Minggu</option>
            <option value="month">Per Bulan</option>
            <option value="year">Per Tahun</option>
            <option value="all">Keseluruhan</option>
          </select>
        </div>
      </div>

      {/* Area Chart - Jumlah Pemesanan */}
      <div className="chart-container">
        <div className="chart-title">📈 Trend Pemesanan</div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#666"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '13px' }}
              iconType="circle"
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#4CAF50" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorCount)"
              name="Jumlah Pemesanan"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Revenue */}
      <div className="chart-container">
        <div className="chart-title">💰 Total Pendapatan</div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#666"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<RevenueTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '13px' }}
              iconType="square"
            />
            <Bar 
              dataKey="revenue" 
              fill="#2196F3"
              radius={[8, 8, 0, 0]}
              name="Pendapatan (Rp)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stacked Bar Chart - Status Distribution */}
      <div className="chart-container">
        <div className="chart-title">📊 Distribusi Status Pemesanan</div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#666"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '13px' }}
              iconType="square"
            />
            <Bar 
              dataKey="confirmed" 
              stackId="a" 
              fill="#4CAF50"
              radius={[0, 0, 0, 0]}
              name="Confirmed"
            />
            <Bar 
              dataKey="completed" 
              stackId="a" 
              fill="#2196F3"
              radius={[0, 0, 0, 0]}
              name="Completed"
            />
            <Bar 
              dataKey="pending" 
              stackId="a" 
              fill="#FFC107"
              radius={[0, 0, 0, 0]}
              name="Pending"
            />
            <Bar 
              dataKey="cancelled" 
              stackId="a" 
              fill="#F44336"
              radius={[8, 8, 0, 0]}
              name="Cancelled"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart - Overall Status Distribution */}
      <div className="chart-container">
        <div className="chart-title">🥧 Distribusi Status Keseluruhan</div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend 
              wrapperStyle={{ fontSize: '13px' }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats - Only Average */}
      <div className="chart-summary">
        <div className="summary-card">
          <div className="summary-icon">📈</div>
          <div className="summary-info">
            <div className="summary-value">
              {chartData.length > 0 ? (chartData.reduce((acc, d) => acc + d.count, 0) / chartData.length).toFixed(1) : 0}
            </div>
            <div className="summary-label">Rata-rata Pemesanan per Periode</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingChart;
