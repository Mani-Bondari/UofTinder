import React from 'react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <img src="/vite.svg" alt="UofTinder Logo" className="uoftinder-logo" />
      <h1>Welcome to UofTinder</h1>
      <p>This is your home for finding your next campus connection. Start swiping!</p>
      {/* TODO: Add swipe cards and match features */}
    </div>
  );
};

export default Home; 