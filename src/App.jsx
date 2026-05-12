import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    ride_number: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    type: 'bike'
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${API_BASE_URL}/login`, { username, password });
      setIsLoggedIn(true);
      fetchRides();
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  const fetchRides = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/rides`);
      setRides(res.data);
    } catch (err) {
      console.error('Error fetching rides:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRide = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/rides`, {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setFormData({
        ...formData,
        ride_number: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].substring(0, 5)
      });
      fetchRides();
    } catch (err) {
      console.error('Error adding ride:', err);
    }
  };

  const handleDeleteRide = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/rides/${id}`);
      fetchRides();
    } catch (err) {
      console.error('Error deleting ride:', err);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  if (!isLoggedIn) {
    return (
      <div className="card">
        <h1>Rapido Login</h1>
        <p className="subtitle">Please enter your admin credentials</p>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              placeholder="admin" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">Login</button>
          {error && <p className="error-msg">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="card dashboard-card">
      <div className="logout-bar">
        <div>
          <h1>Rapido Dashboard</h1>
          <p style={{color: 'var(--primary)', textAlign: 'left', fontWeight: '600'}}>welcome Kalyan 👋</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      
      <div className="dashboard-grid">
        <div className="form-section">
          <h3>Add New Track</h3>
          <form onSubmit={handleAddRide} className="login-form" style={{marginTop: '20px'}}>
            <div className="form-group">
              <label>Ride/Parcel Number</label>
              <input 
                type="text" 
                value={formData.ride_number}
                onChange={(e) => setFormData({...formData, ride_number: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input 
                type="number" 
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="bike">Bike Ride</option>
                <option value="parcel">Parcel Delivery</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input 
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input 
                type="time" 
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn">Add Record</button>
          </form>
        </div>

        <div className="list-section">
          <h3>Daily Track History</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Date/Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rides.length === 0 ? (
                  <tr><td colSpan="5" style={{textAlign: 'center'}}>No records found</td></tr>
                ) : (
                  rides.slice().reverse().map(ride => (
                    <tr key={ride.id}>
                      <td>{ride.ride_number}</td>
                      <td>₹{ride.amount}</td>
                      <td>
                        <span className={`ride-type type-${ride.type}`}>
                          {ride.type}
                        </span>
                      </td>
                      <td style={{fontSize: '0.8rem'}}>
                        {ride.date}<br/>{ride.time}
                      </td>
                      <td>
                        <button 
                          className="btn btn-danger" 
                          onClick={() => handleDeleteRide(ride.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
