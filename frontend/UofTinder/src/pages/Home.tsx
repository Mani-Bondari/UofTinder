import React, { useEffect, useState } from 'react';
import './Home.css';

interface User {
  id: number;
  username: string;
  elo: number;
}

const Home: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with real JWT auth
    fetch('/api/recommend/', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer <token>'
      },
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="home-container">
      <img src="/vite.svg" alt="UofTinder Logo" className="uoftinder-logo" />
      <h1>Welcome to UofTinder</h1>
      <p>These are users closest to your ELO:</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="user-list">
          {users.map(user => (
            <li key={user.id} className="user-list-item">
              <span className="user-name">{user.username}</span>
              <span className="user-elo">ELO: {user.elo}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home; 