import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function AdminMapSettings() {
  const [mapSettings, setMapSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { data: session } = useSession();
  
  const userTypes = ['user', 'builder', 'broker', 'premium'];
  const mapProviders = ['google', 'mapbox', 'openstreetmap'];

  useEffect(() => {
    fetchAdminConfig();
  }, []);

  const fetchAdminConfig = async () => {
    try {
      const response = await fetch('/api/maps/admin-config');
      const data = await response.json();
      if (data.success) {
        setMapSettings(data.data.userTypeAccess || {});
      }
    } catch (error) {
      setMessage('❌ Failed to load map settings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMapToggle = async (userType, mapProvider, isEnabled) => {
    try {
      setLoading(true);
      const currentMaps = mapSettings[userType] || [];
      let updatedMaps;
      
      if (isEnabled) {
        updatedMaps = currentMaps.filter(m => m !== mapProvider);
      } else {
        updatedMaps = [...currentMaps, mapProvider];
      }

      const response = await fetch('/api/maps/admin/user-map-access', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.token}` // Use token from session
        },
        body: JSON.stringify({
          userType,
          availableMaps: updatedMaps,
        })
      });

      const data = await response.json();
      if (data.success) {
        setMapSettings(prev => ({
          ...prev,
          [userType]: updatedMaps
        }));
        setMessage(`✅ Updated map access for ${userType}`);
      } else {
        setMessage('❌ ' + (data.error || 'Update failed'));
      }
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/maps/admin/analytics');
      const data = await response.json();
      if (data.success) {
        alert('📊 Map Usage Analytics:\n' + JSON.stringify(data.data, null, 2));
      }
    } catch (error) {
      setMessage('❌ Failed to load analytics: ' + error.message);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading map settings...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h1>🗺️ Admin Map Settings</h1>
      <p style={{ color: '#666' }}>Control which maps are available for each user type</p>

      {message && (
        <div style={{
          padding: '12px',
          marginBottom: '20px',
          backgroundColor: message.includes('❌') ? '#f8d7da' : '#d4edda',
          borderRadius: '6px',
          color: message.includes('❌') ? '#721c24' : '#155724'
        }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gap: '20px' }}>
        {userTypes.map(userType => (
          <div key={userType} style={{
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}>
            <h3 style={{ margin: '0 0 15px 0', textTransform: 'capitalize' }}>
              📌 {userType === 'premium' ? 'Premium Users' : userType}
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {mapProviders.map(provider => {
                const isEnabled = (mapSettings[userType] || []).includes(provider);
                return (
                  <label key={provider} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: isEnabled ? '#667eea22' : '#fff',
                    borderRadius: '6px',
                    border: isEnabled ? '2px solid #667eea' : '1px solid #ddd',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}>
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => handleMapToggle(userType, provider, isEnabled)}
                      style={{ marginRight: '10px', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <div>
                      <strong style={{ textTransform: 'capitalize', display: 'block' }}>
                        {provider === 'google' ? '🔴 Google Maps' : 
                         provider === 'mapbox' ? '🔵 Mapbox' : 
                         '🟢 OpenStreetMap'}
                      </strong>
                      <small style={{ color: '#666' }}>
                        {provider === 'google' ? 'Premium features' : 
                         provider === 'mapbox' ? 'Professional maps' : 
                         'Free & open'}
                      </small>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={fetchAnalytics}
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          backgroundColor: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        📊 View Analytics
      </button>

      {/* Default Presets */}
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h3>⚡ Quick Presets</h3>
        <p style={{ color: '#666' }}>Click to apply preset configurations:</p>
        
        <button
          onClick={() => {
            setMapSettings({
              premium: ['google', 'mapbox', 'openstreetmap'],
              builder: ['mapbox', 'openstreetmap'],
              broker: ['mapbox', 'openstreetmap'],
              user: ['mapbox', 'openstreetmap']
            });
            setMessage('✅ Applied "Standard" configuration');
          }}
          style={{
            padding: '10px 15px',
            marginRight: '10px',
            marginBottom: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Standard Setup
        </button>

        <button
          onClick={() => {
            setMapSettings({
              premium: ['google', 'mapbox'],
              builder: ['mapbox'],
              broker: ['mapbox'],
              user: ['mapbox']
            });
            setMessage('✅ Applied "Mapbox First" configuration');
          }}
          style={{
            padding: '10px 15px',
            marginRight: '10px',
            marginBottom: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Mapbox First
        </button>

        <button
          onClick={() => {
            setMapSettings({
              premium: ['google', 'mapbox', 'openstreetmap'],
              builder: ['google', 'mapbox', 'openstreetmap'],
              broker: ['google', 'mapbox', 'openstreetmap'],
              user: ['google', 'mapbox', 'openstreetmap']
            });
            setMessage('✅ Applied "All Maps for Everyone" configuration');
          }}
          style={{
            padding: '10px 15px',
            marginRight: '10px',
            marginBottom: '10px',
            backgroundColor: '#ffc107',
            color: '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          All Maps for Everyone
        </button>
      </div>

      {/* Info Box */}
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e7f3ff', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
        <h4>ℹ️ Map Provider Information</h4>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li><strong>Google Maps:</strong> Premium features, satellite view, street view, best distance calculations. Requires API key.</li>
          <li><strong>Mapbox:</strong> Professional maps, real-time data, excellent performance. Recommended for most users.</li>
          <li><strong>OpenStreetMap:</strong> Free and open source, community-driven, good for basic mapping. No cost.</li>
        </ul>
      </div>
    </div>
  );
}
