
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ProfileBadgeProps {
  highScore: number;
  onNameChange: (name: string) => void;
  initialName: string;
}

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="35" r="20"/>
    <path d="M50 60 C 30 60, 20 80, 20 90 L 80 90 C 80 80, 70 60, 50 60 Z"/>
  </svg>
);

const ProfileBadge: React.FC<ProfileBadgeProps> = ({ highScore, onNameChange, initialName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleNameSubmit = () => {
    onNameChange(name);
    setIsEditing(false);
  };

  return (
    <div className="absolute top-4 right-4 z-40 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg text-gray-700 font-fredoka">
      <div className="flex items-center space-x-3">
        <UserIcon className="w-10 h-10 text-blue-500" />
        <div>
          {isEditing ? (
            <div className="flex items-center space-x-1">
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value.slice(0,15))} // Limit name length
                onBlur={handleNameSubmit}
                onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                className="p-1 text-sm border border-blue-400 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                autoFocus
              />
              <button onClick={handleNameSubmit} className="p-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">Save</button>
            </div>
          ) : (
            <p 
              className="text-lg font-semibold cursor-pointer hover:text-blue-600" 
              onClick={() => setIsEditing(true)}
              title="Click to edit name"
            >
              {name || "Player"}
            </p>
          )}
          <p className="text-sm">High Score: <span className="font-bold text-orange-500">{highScore}</span></p>
        </div>
      </div>
    </div>
  );
};

export default ProfileBadge;
