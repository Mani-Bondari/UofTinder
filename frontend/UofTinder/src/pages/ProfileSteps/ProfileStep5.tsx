import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfileStep5Props {
  onComplete: () => void;
}

const ProfileStep5: React.FC<ProfileStep5Props> = ({ onComplete }) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhoto(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to backend
    onComplete();
  };

  return (
    <form className="profile-step" onSubmit={handleFinish}>
      <h2>Profile Photo</h2>
      <div className="photo-upload">
        {photo ? (
          <img src={photo} alt="Profile preview" className="profile-photo-preview" />
        ) : (
          <button type="button" onClick={() => fileInputRef.current?.click()}>
            Upload Photo
          </button>
        )}
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handlePhotoChange}
        />
      </div>
      <div className="profile-step-nav">
        <button type="button" onClick={() => navigate(-1)}>Back</button>
        <button type="submit">Finish</button>
      </div>
    </form>
  );
};

export default ProfileStep5; 