import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileStep3: React.FC = () => {
  const [interests, setInterests] = useState('');
  const navigate = useNavigate();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to context or backend
    navigate('/profile-setup/step4');
  };

  return (
    <form className="profile-step" onSubmit={handleNext}>
      <h2>Your Interests</h2>
      <label>
        List a few interests (comma separated)
        <input value={interests} onChange={e => setInterests(e.target.value)} placeholder="e.g. hiking, music, coding" required />
      </label>
      <div className="profile-step-nav">
        <button type="button" onClick={() => navigate(-1)}>Back</button>
        <button type="submit">Next</button>
      </div>
    </form>
  );
};

export default ProfileStep3; 