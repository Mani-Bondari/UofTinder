import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileSetup } from '../ProfileSetup';

const ProfileStep4: React.FC = () => {
  const { answers, setAnswers } = useProfileSetup();
  const navigate = useNavigate();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/profile-setup/step5');
  };

  return (
    <form className="profile-step" onSubmit={handleNext}>
      <h2>Your Bio & First Message</h2>
      <label>
        Tell us about yourself
        <textarea value={answers.bio} onChange={e => setAnswers(a => ({ ...a, bio: e.target.value }))} maxLength={300} rows={4} placeholder="Write a short bio..." required />
      </label>
      <label>
        What would you say to your first match?
        <input value={answers["firstMessage"] || ''} onChange={e => setAnswers(a => ({ ...a, firstMessage: e.target.value }))} placeholder="e.g. What's your go-to study spot?" />
      </label>
      <div className="profile-step-nav">
        <button type="button" onClick={() => navigate(-1)}>Back</button>
        <button type="submit">Next</button>
      </div>
    </form>
  );
};

export default ProfileStep4; 