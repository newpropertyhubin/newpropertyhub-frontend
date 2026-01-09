import React from 'react';

const AdSensePlaceholder = ({ width = '100%', height = '120px' }) => {
  return (
    <div 
      style={{
        width,
        height,
        background: '#e9ecef',
        border: '2px dashed #adb5bd',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '2rem auto',
        borderRadius: '8px'
      }}
    >
      <p style={{ color: '#495057', fontWeight: 'bold' }}>
        Google Ad Placeholder ({width} x {height})
      </p>
    </div>
  );
};

export default AdSensePlaceholder;
