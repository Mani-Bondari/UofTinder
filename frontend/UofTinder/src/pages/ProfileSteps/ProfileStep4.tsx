import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileStep4: React.FC = () => {
  const [bio, setBio] = useState('');
  const navigate = useNavigate();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to context or backend
    navigate('/profile-setup/step5');
  };

  return (
    <form className="profile-step" onSubmit={handleNext}>
      <h2>Your Bio</h2>
      <label>
        Tell us about yourself
        <textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={300} rows={4} placeholder="Write a short bio..." required />
      </label>
      <div className="profile-step-nav">
        <button type="button" onClick={() => navigate(-1)}>Back</button>
        <button type="submit">Next</button>
      </div>
    </form>
  );
};

export default ProfileStep4; 