import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileStep2: React.FC = () => {
  const [program, setProgram] = useState('');
  const [year, setYear] = useState('');
  const navigate = useNavigate();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to context or backend
    navigate('/profile-setup/step3');
  };

  return (
    <form className="profile-step" onSubmit={handleNext}>
      <h2>Your UofT Details</h2>
      <label>
        Program
        <input value={program} onChange={e => setProgram(e.target.value)} required />
      </label>
      <label>
        Year
        <select value={year} onChange={e => setYear(e.target.value)} required>
          <option value="">Select year</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
          <option value="5+">5+ Years</option>
          <option value="grad">Graduate</option>
        </select>
      </label>
      <div className="profile-step-nav">
        <button type="button" onClick={() => navigate(-1)}>Back</button>
        <button type="submit">Next</button>
      </div>
    </form>
  );
};

export default ProfileStep2; 