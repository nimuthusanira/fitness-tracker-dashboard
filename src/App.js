import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { ref, onValue } from "firebase/database";
import './App.css';

function App() {
  const [data, setData] = useState({
    heart_rate: 0,
    body_temp: 0,
    steps: 0,
    lat: 0,
    lng: 0
  });

  const stepGoal = 5000; // You can change your daily goal here

  useEffect(() => {
    const healthRef = ref(db, 'sensorData');
    onValue(healthRef, (snapshot) => {
      const val = snapshot.val();
      if (val) setData(val);
    });
  }, []);

  // Logic for Health Status
  const getStatus = () => {
    if (data.heart_rate === 0) return { text: "No Data", color: "#888" };
    if (data.heart_rate > 100) return { text: "High Heart Rate", color: "#ff4757" };
    if (data.heart_rate < 60) return { text: "Resting", color: "#1e90ff" };
    return { text: "Normal / Healthy", color: "#2ed573" };
  };

  const status = getStatus();

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="title">VITAL-TRACE PRO</h1>
        <div className="status-badge" style={{ backgroundColor: status.color }}>
          {status.text}
        </div>

        <div className="dashboard-grid">
          {/* Heart Rate Card */}
          <div className="card heart-card">
            <div className="icon pulse">❤️</div>
            <h3>Heart Rate</h3>
            <div className="value">{data.heart_rate} <span>BPM</span></div>
          </div>

          {/* Temperature Card */}
          <div className="card temp-card">
            <div className="icon">🌡️</div>
            <h3>Body Temp</h3>
            <div className="value">{data.body_temp.toFixed(1)} <span>°C</span></div>
          </div>

          {/* Steps Progress Card */}
          <div className="card steps-card">
            <div className="icon">👟</div>
            <h3>Activity</h3>
            <div className="value">{data.steps} <span>Steps</span></div>
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ width: `${Math.min((data.steps / stepGoal) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="goal-text">Goal: {stepGoal}</p>
          </div>

          {/* Location Card */}
          <div className="card location-card">
            <div className="icon">📍</div>
            <h3>Live Location</h3>
            <p>Lat: {data.lat.toFixed(4)}</p>
            <p>Lng: {data.lng.toFixed(4)}</p>
            <a 
              href={`https://www.google.com/maps?q=${data.lat},${data.lng}`} 
              target="_blank" 
              rel="noreferrer"
              className="map-btn"
            >
              View on Map
            </a>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
