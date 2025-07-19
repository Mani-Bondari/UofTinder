import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileStep1: React.FC = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [pronouns, setPronouns] = useState('');
  const navigate = useNavigate();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to context or backend
    navigate('/profile-setup/step2');
  };

  return (
    <form className="profile-step" onSubmit={handleNext}>
      <h2>Let's get started!</h2>
      <label>
        Name
        <input value={name} onChange={e => setName(e.target.value)} required />
      </label>
      <label>
        Age
        <input type="number" min="17" max="99" value={age} onChange={e => setAge(e.target.value)} required />
      </label>
      <label>
        Pronouns
        <input value={pronouns} onChange={e => setPronouns(e.target.value)} placeholder="e.g. she/her, he/him, they/them" />
      </label>
      <button type="submit">Next</button>
    </form>
  );
};

export default ProfileStep1; 