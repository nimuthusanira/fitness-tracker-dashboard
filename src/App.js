import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { ref, onValue } from "firebase/database";
import './App.css';

function App() {
  const [data, setData] = useState({ heart_rate: 0, body_temp: 0, steps: 0, lat: 0, lng: 0 });
  const [stepGoal, setStepGoal] = useState(5000);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const healthRef = ref(db, 'sensorData');
    onValue(healthRef, (snapshot) => {
      const val = snapshot.val();
      if (val) setData(val);
    });
  }, []);

  // Distance calculation (Steps * 0.75m / 1000 for KM)
  const distanceKm = (data.steps * 0.75 / 1000).toFixed(2);
  const progressPercent = Math.min((data.steps / stepGoal) * 100, 100);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="title">VITAL-TRACE PRO</h1>
        
        {/* Goal Setting Section */}
        <div className="goal-setter">
          <label>Set Step Goal: </label>
          <input 
            type="number" 
            value={stepGoal} 
            onChange={(e) => setStepGoal(e.target.value)} 
          />
        </div>

        <div className="dashboard-grid">
          <div className="card heart-card">
            <div className="icon pulse">❤️</div>
            <h3>Heart Rate</h3>
            <div className="value">{data.heart_rate} <span>BPM</span></div>
          </div>

          <div className="card steps-card">
            <div className="icon">🏃‍♂️</div>
            <h3>Distance</h3>
            <div className="value">{distanceKm} <span>KM</span></div>
          </div>

          <div className="card steps-card">
            <div className="icon">👟</div>
            <h3>Daily Steps</h3>
            <div className="value">{data.steps}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <p>{progressPercent.toFixed(1)}% of {stepGoal} Goal</p>
          </div>
        </div>

        <button className="finish-btn" onClick={() => setShowModal(true)}>Show Session Results</button>

        {/* Results Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Session Summary 📊</h2>
              <hr />
              <div className="chart-area">
                <p>Steps vs Goal</p>
                <div className="bar-chart">
                  <div className="bar goal-bar" style={{height: '100%'}}><span>Goal</span></div>
                  <div className="bar current-bar" style={{height: `${progressPercent}%`}}><span>Steps</span></div>
                </div>
              </div>
              <p>Total Distance: <strong>{distanceKm} KM</strong></p>
              <p>Avg Heart Rate: <strong>{data.heart_rate} BPM</strong></p>
              <button className="close-btn" onClick={() => setShowModal(false)}>Back to Live</button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
