
import React from 'react';
import type { Cloud as CloudType } from '../types';

interface CloudProps {
  cloud: CloudType;
}

const Cloud: React.FC<CloudProps> = ({ cloud }) => {
  const cloudBaseStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${cloud.x}px`,
    top: `${cloud.y}px`,
    width: `${cloud.width}px`,
    height: `${cloud.height}px`,
    opacity: 0.8,
  };

  // Using multiple divs to create a fluffy cloud shape
  return (
    <div style={cloudBaseStyle} className="z-0">
      <div className="absolute bg-white rounded-full" style={{ width: '100%', height: '100%', top: 0, left: 0 }}></div>
      <div className="absolute bg-white rounded-full" style={{ width: '60%', height: '60%', top: '-20%', left: '20%' }}></div>
      <div className="absolute bg-white rounded-full" style={{ width: '70%', height: '70%', top: '10%', left: '-15%' }}></div>
      <div className="absolute bg-white rounded-full" style={{ width: '70%', height: '70%', top: '10%', left: '45%' }}></div>
    </div>
  );
};

export default Cloud;
