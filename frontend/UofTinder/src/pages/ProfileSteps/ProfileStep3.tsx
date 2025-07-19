import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileSetup } from '../ProfileSetup';

const ProfileStep3: React.FC = () => {
  const { answers, setAnswers } = useProfileSetup();
  const navigate = useNavigate();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/profile-setup/step4');
  };

  return (
    <form className="profile-step" onSubmit={handleNext}>
      <h2>Your Interests & Match</h2>
      <label>
        List a few interests (comma separated)
        <input value={answers.interests} onChange={e => setAnswers(a => ({ ...a, interests: e.target.value }))} placeholder="e.g. hiking, music, coding" required />
      </label>
      <label>
        What makes a good match for you?
        <input value={answers["goodMatch"] || ''} onChange={e => setAnswers(a => ({ ...a, goodMatch: e.target.value }))} placeholder="e.g. Someone who..." />
      </label>
      <div className="profile-step-nav">
        <button type="button" onClick={() => navigate(-1)}>Back</button>
        <button type="submit">Next</button>
      </div>
    </form>
  );
};

export default ProfileStep3; 