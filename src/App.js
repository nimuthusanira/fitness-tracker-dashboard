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
  const [stepGoal, setStepGoal] = useState(5000);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Connect to your specific Firebase path
    const healthRef = ref(db, 'sensorData');
    onValue(healthRef, (snapshot) => {
      const val = snapshot.val();
      if (val) setData(val);
    });
  }, []);

  // Professional calculations
  const distanceKm = (data.steps * 0.75 / 1000).toFixed(2);
  const progressPercent = Math.min((data.steps / stepGoal) * 100, 100);

  // Health Status Logic
  const getStatusText = () => {
    if (data.heart_rate === 0) return "WAITING FOR DATA...";
    if (data.heart_rate > 100) return "HIGH INTENSITY";
    return "HEALTHY / STABLE";
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="title">VITAL-TRACE PRO</h1>
        
        <div className="status-bar">
           {getStatusText()}
        </div>

        <div className="goal-setter">
          <label>Target Steps: </label>
          <input 
            type="number" 
            value={stepGoal} 
            onChange={(e) => setStepGoal(e.target.value)} 
          />
        </div>

        <div className="dashboard-grid">
          {/* Heart Rate Section */}
          <div className="card">
            <div className="icon pulse">❤️</div>
            <h3>Heart Rate</h3>
            <div className="value">{data.heart_rate} <span>BPM</span></div>
          </div>

          {/* Activity/Distance Section */}
          <div className="card">
            <div className="icon">🏃‍♂️</div>
            <h3>Distance</h3>
            <div className="value">{distanceKm} <span>KM</span></div>
          </div>

          {/* Steps & Progress Section */}
          <div className="card">
            <div className="icon">👟</div>
            <h3>Total Steps</h3>
            <div className="value">{data.steps}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <p className="goal-text">{progressPercent.toFixed(1)}% of Daily Goal</p>
          </div>

          {/* Live GPS & Map Section */}
          <div className="card map-card">
            <div className="icon">📍</div>
            <h3>Live Location</h3>
            <div className="geo-data">
              <p>LAT: {data.lat.toFixed(5)}</p>
              <p>LNG: {data.lng.toFixed(5)}</p>
            </div>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${data.lat},${data.lng}`} 
              target="_blank" 
              rel="noreferrer" 
              className="map-btn"
            >
              View Real-time Map
            </a>
          </div>
        </div>

        <button className="finish-btn" onClick={() => setShowModal(true)}>
          GENERATE SESSION REPORT
        </button>

        {/* Professional Summary Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Session Summary 📊</h2>
              <div className="bar-chart">
                <div className="bar goal-bar"><span>GOAL</span></div>
                <div className="bar current-bar" style={{height: `${progressPercent}%`}}>
                   <span>STEPS</span>
                </div>
              </div>
              <div className="summary-stats">
                <p>Total Distance Covered: <strong>{distanceKm} KM</strong></p>
                <p>Current Heart Rate: <strong>{data.heart_rate} BPM</strong></p>
                <p>Steps Taken: <strong>{data.steps}</strong></p>
              </div>
              <button className="close-btn" onClick={() => setShowModal(false)}>BACK TO DASHBOARD</button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
