import React, { createContext, useContext, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ProfileStep1 from './ProfileSteps/ProfileStep1';
import ProfileStep2 from './ProfileSteps/ProfileStep2';
import ProfileStep3 from './ProfileSteps/ProfileStep3';
import ProfileStep4 from './ProfileSteps/ProfileStep4';
import ProfileStep5 from './ProfileSteps/ProfileStep5';
import './ProfileSetup.css';

// Profile context for all answers
const MAX_PHOTOS = 6;
export interface ProfileAnswers {
  name: string;
  age: string;
  pronouns: string;
  program: string;
  year: string;
  interests: string;
  bio: string;
  photos: (string | null)[];
}
const defaultAnswers: ProfileAnswers = {
  name: '', age: '', pronouns: '', program: '', year: '', interests: '', bio: '', photos: Array(MAX_PHOTOS).fill(null)
};
const ProfileSetupContext = createContext<{
  answers: ProfileAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<ProfileAnswers>>;
}>({ answers: defaultAnswers, setAnswers: () => {} });
export const useProfileSetup = () => useContext(ProfileSetupContext);

const ProfileSetup: React.FC = () => {
  const [answers, setAnswers] = useState<ProfileAnswers>(defaultAnswers);
  const navigate = useNavigate();

  const handleComplete = () => {
    // TODO: Save profile to backend
    navigate('/home');
  };

  return (
    <ProfileSetupContext.Provider value={{ answers, setAnswers }}>
      <div className="profile-setup-container">
        <Routes>
          <Route path="" element={<ProfileStep1 />} />
          <Route path="step2" element={<ProfileStep2 />} />
          <Route path="step3" element={<ProfileStep3 />} />
          <Route path="step4" element={<ProfileStep4 />} />
          <Route path="step5" element={<ProfileStep5 onComplete={handleComplete} photos={answers.photos} setPhotos={photos => setAnswers(a => ({ ...a, photos }))} />} />
        </Routes>
      </div>
    </ProfileSetupContext.Provider>
  );
};

export default ProfileSetup; 