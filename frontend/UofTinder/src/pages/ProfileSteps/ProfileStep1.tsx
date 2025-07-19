import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileSetup } from '../ProfileSetup';

const ProfileStep1: React.FC = () => {
  const { answers, setAnswers } = useProfileSetup();
  const navigate = useNavigate();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/profile-setup/step2');
  };

  return (
    <form className="profile-step" onSubmit={handleNext}>
      <h2>Let's get started!</h2>
      <label>
        Name
        <input value={answers.name} onChange={e => setAnswers(a => ({ ...a, name: e.target.value }))} required />
      </label>
      <label>
        Age
        <input type="number" min="17" max="99" value={answers.age} onChange={e => setAnswers(a => ({ ...a, age: e.target.value }))} required />
      </label>
      <label>
        Pronouns
        <input value={answers.pronouns} onChange={e => setAnswers(a => ({ ...a, pronouns: e.target.value }))} placeholder="e.g. she/her, he/him, they/them" />
      </label>
      <label>
        Campus
        <select value={answers["campus"] || ''} onChange={e => setAnswers(a => ({ ...a, campus: e.target.value }))} required>
          <option value="">Select campus</option>
          <option value="St. George">St. George</option>
          <option value="Scarborough">Scarborough (UTSC)</option>
          <option value="Mississauga">Mississauga (UTM)</option>
        </select>
      </label>
      <label>
        College/Faculty
        <input value={answers["college"] || ''} onChange={e => setAnswers(a => ({ ...a, college: e.target.value }))} placeholder="e.g. Trinity, Innis, Engineering" required />
      </label>
      <label>
        Gender
        <input value={answers["gender"] || ''} onChange={e => setAnswers(a => ({ ...a, gender: e.target.value }))} placeholder="e.g. Woman, Man, Non-binary" required />
      </label>
      <label>
        Sexual Orientation
        <input value={answers["orientation"] || ''} onChange={e => setAnswers(a => ({ ...a, orientation: e.target.value }))} placeholder="e.g. Straight, Gay, Bi, etc." required />
      </label>
      <label>
        Looking for
        <select value={answers["lookingFor"] || ''} onChange={e => setAnswers(a => ({ ...a, lookingFor: e.target.value }))} required>
          <option value="">Select</option>
          <option value="Friendship">Friendship</option>
          <option value="Dating">Dating</option>
          <option value="Long-term">Long-term</option>
          <option value="Short-term">Short-term</option>
          <option value="Open to anything">Open to anything</option>
        </select>
      </label>
      <label>
        Height (cm)
        <input type="number" min="100" max="250" value={answers["height"] || ''} onChange={e => setAnswers(a => ({ ...a, height: e.target.value }))} />
      </label>
      <button type="submit">Next</button>
    </form>
  );
};

export default ProfileStep1; 