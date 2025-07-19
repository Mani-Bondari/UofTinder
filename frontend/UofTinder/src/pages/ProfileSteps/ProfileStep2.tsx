import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileSetup } from '../ProfileSetup';

const hobbiesList = [
  'Sports', 'Music', 'Art', 'Coding', 'Reading', 'Travel', 'Food', 'Gaming', 'Volunteering', 'Fitness', 'Movies', 'Photography', 'Writing', 'Dancing', 'Theatre', 'Outdoors', 'Student Clubs', 'Other'
];

const ProfileStep2: React.FC = () => {
  const { answers, setAnswers } = useProfileSetup();
  const navigate = useNavigate();

  const handleHobbyToggle = (hobby: string) => {
    const current = answers.hobbies || [];
    setAnswers(a => ({ ...a, hobbies: current.includes(hobby) ? current.filter(h => h !== hobby) : [...current, hobby] }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/profile-setup/step3');
  };

  return (
    <form className="profile-step" onSubmit={handleNext}>
      <h2>More About You</h2>
      <label>
        Program
        <input value={answers.program} onChange={e => setAnswers(a => ({ ...a, program: e.target.value }))} required />
      </label>
      <label>
        Year
        <select value={answers.year} onChange={e => setAnswers(a => ({ ...a, year: e.target.value }))} required>
          <option value="">Select year</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
          <option value="5+">5+ Years</option>
          <option value="grad">Graduate</option>
        </select>
      </label>
      <label>
        Hobbies/Passions
        <div className="hobbies-list">
          {hobbiesList.map(hobby => (
            <label key={hobby} className="hobby-chip">
              <input
                type="checkbox"
                checked={(answers.hobbies || []).includes(hobby)}
                onChange={() => handleHobbyToggle(hobby)}
              />
              {hobby}
            </label>
          ))}
        </div>
      </label>
      <label>
        Favourite UofT Spot
        <input value={answers["favSpot"] || ''} onChange={e => setAnswers(a => ({ ...a, favSpot: e.target.value }))} placeholder="e.g. Robarts, Hart House, etc." />
      </label>
      <label>
        Fun Fact or Icebreaker
        <input value={answers["funFact"] || ''} onChange={e => setAnswers(a => ({ ...a, funFact: e.target.value }))} placeholder="e.g. I can juggle, I love bubble tea..." />
      </label>
      <label>
        Dealbreakers (optional)
        <input value={answers["dealbreakers"] || ''} onChange={e => setAnswers(a => ({ ...a, dealbreakers: e.target.value }))} placeholder="e.g. Smoking, etc." />
      </label>
      <label>
        Socials (optional)
        <input value={answers["socials"] || ''} onChange={e => setAnswers(a => ({ ...a, socials: e.target.value }))} placeholder="Instagram, LinkedIn, etc." />
      </label>
      <div className="profile-step-nav">
        <button type="button" onClick={() => navigate(-1)}>Back</button>
        <button type="submit">Next</button>
      </div>
    </form>
  );
};

export default ProfileStep2; 