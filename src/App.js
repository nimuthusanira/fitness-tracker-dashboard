import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { ref, onValue } from "firebase/database";
import './App.css';

function App() {
  const [data, setData] = useState({
    heart_rate: 0,
    body_temp: 0,
    lat: 0,
    lng: 0
  });

  useEffect(() => {
    const healthRef = ref(db, 'sensorData'); // This matches your ESP32 path
    onValue(healthRef, (snapshot) => {
      const val = snapshot.val();
      if (val) setData(val);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Fitness Tracker Live</h1>
        <div className="dashboard">
          <div className="card">
            <h2>❤️ Heart Rate</h2>
            <p className="value">{data.heart_rate} <span>BPM</span></p>
          </div>
          
          <div className="card">
            <h2>🌡️ Body Temp</h2>
            <p className="value">{data.body_temp} <span>°C</span></p>
          </div>

          <div className="card">
            <h2>📍 Location</h2>
            <p className="small-value">Lat: {data.lat}</p>
            <p className="small-value">Lng: {data.lng}</p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;