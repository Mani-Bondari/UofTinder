import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfileStep5Props {
  onComplete: () => void;
  photos?: (string | null)[];
  setPhotos?: (photos: (string | null)[]) => void;
}

const MAX_PHOTOS = 6;

const ProfileStep5: React.FC<ProfileStep5Props> = ({ onComplete, photos = Array(MAX_PHOTOS).fill(null), setPhotos }) => {
  const fileInputRefs = Array.from({ length: MAX_PHOTOS }, () => useRef<HTMLInputElement>(null));
  const navigate = useNavigate();

  const handlePhotoChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && setPhotos) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const newPhotos = [...photos];
        newPhotos[idx] = ev.target?.result as string;
        setPhotos(newPhotos);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleRemove = (idx: number) => {
    if (setPhotos) {
      const newPhotos = [...photos];
      newPhotos[idx] = null;
      setPhotos(newPhotos);
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (photos.filter(Boolean).length === 0) return;
    // TODO: Save to backend
    onComplete();
  };

  return (
    <form className="profile-step" onSubmit={handleFinish}>
      <h2>Profile Photos</h2>
      <div className="photo-grid">
        {photos.map((photo, idx) => (
          <div className="photo-slot" key={idx}>
            {photo ? (
              <>
                <img src={photo} alt={`Profile ${idx + 1}`} className="profile-photo-preview" />
                <button type="button" className="remove-photo" onClick={() => handleRemove(idx)}>×</button>
              </>
            ) : (
              <button type="button" onClick={() => fileInputRefs[idx].current?.click()} className="add-photo">+</button>
            )}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRefs[idx]}
              onChange={e => handlePhotoChange(idx, e)}
            />
          </div>
        ))}
      </div>
      <div className="profile-step-nav">
        <button type="button" onClick={() => navigate(-1)}>Back</button>
        <button type="submit" disabled={photos.filter(Boolean).length === 0}>Finish</button>
      </div>
    </form>
  );
};

export default ProfileStep5; 