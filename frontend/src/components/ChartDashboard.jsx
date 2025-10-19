// Chart dashboard component with summary cards and charts
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserChart from './UserChart.jsx';

const ChartDashboard = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('line');

  // Fetch chart data
  const fetchChartData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/chart-data');
      setChartData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load chart data: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  if (loading) {
    return (
      <div className="chart-dashboard">
        <div className="loading">Loading chart data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-dashboard">
        <div className="error">{error}</div>
        <button className="btn" onClick={fetchChartData}>
          Retry
        </button>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="chart-dashboard">
        <div className="loading">No chart data available</div>
      </div>
    );
  }

  return (
    <div className="chart-dashboard">
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">👥</div>
          <div className="card-content">
            <h3>Total Users</h3>
            <p className="card-number">{chartData.totalUsers}</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon">📅</div>
          <div className="card-content">
            <h3>Today's Users</h3>
            <p className="card-number">{chartData.todayUsers}</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>Week Average</h3>
            <p className="card-number">{chartData.weekAverage}</p>
          </div>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="chart-controls">
        <h2>User Creation Analytics</h2>
        <div className="chart-type-buttons">
          <button 
            className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`}
            onClick={() => setChartType('line')}
          >
            📈 Line Chart
          </button>
          <button 
            className={`chart-type-btn ${chartType === 'bar' ? 'active' : ''}`}
            onClick={() => setChartType('bar')}
          >
            📊 Bar Chart
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="chart-wrapper">
        <UserChart chartData={chartData} type={chartType} />
      </div>

      {/* Refresh Button */}
      <div className="chart-actions">
        <button className="btn" onClick={fetchChartData}>
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
};

export default ChartDashboard;
