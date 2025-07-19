import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ProfileStep1 from './ProfileSteps/ProfileStep1';
import ProfileStep2 from './ProfileSteps/ProfileStep2';
import ProfileStep3 from './ProfileSteps/ProfileStep3';
import ProfileStep4 from './ProfileSteps/ProfileStep4';
import ProfileStep5 from './ProfileSteps/ProfileStep5';
import './ProfileSetup.css';

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    // TODO: Save profile to backend
    navigate('/home');
  };

  return (
    <div className="profile-setup-container">
      <Routes>
        <Route path="" element={<ProfileStep1 />} />
        <Route path="step2" element={<ProfileStep2 />} />
        <Route path="step3" element={<ProfileStep3 />} />
        <Route path="step4" element={<ProfileStep4 />} />
        <Route path="step5" element={<ProfileStep5 onComplete={handleComplete} />} />
      </Routes>
    </div>
  );
};

export default ProfileSetup; 