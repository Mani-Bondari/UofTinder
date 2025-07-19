import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with Django backend
    navigate('/profile-setup');
  };

  return (
    <div className="auth-container">
      <img src="/vite.svg" alt="UofTinder Logo" className="uoftinder-logo" />
      <h2>Login to UofTinder</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="UofT Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
};

export default Login; 