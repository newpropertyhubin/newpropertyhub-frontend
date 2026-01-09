import { useState, useEffect } from 'react';

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#333',
  },
  mapSelector: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '20px',
  },
  mapOption: {
    padding: '15px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: '#fff',
    position: 'relative',
  },
  mapOptionSelected: {
    borderColor: '#667eea',
    backgroundColor: '#f0f5ff',
    boxShadow: '0 0 10px rgba(102, 126, 234, 0.3)',
  },
  mapOptionPremium: {
    borderColor: '#FFD700',
    backgroundColor: '#FFFACD',
  },
  mapIcon: {
    fontSize: '32px',
    marginBottom: '10px',
  },
  mapName: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#333',
  },
  mapDescription: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '10px',
  },
  premiumBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#FFD700',
    color: '#333',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  mapViewer: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  searchBox: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    boxSizing: 'border-box',
  },
  mapFrame: {
    width: '100%',
    height: '400px',
    borderRadius: '6px',
    backgroundColor: '#e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999',
    fontSize: '14px',
  },
  coordinatesDisplay: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#666',
  },
  button: {
    padding: '10px 20px',
    marginRight: '10px',
    marginTop: '10px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#667eea',
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    color: '#333',
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
  },
  error: {
    padding: '10px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    borderRadius: '6px',
    marginBottom: '15px',
  },
};

export default function PropertyMapSelector({
  userType = 'user',
  isPremium = false,
  onMapSelected = () => {},
  onLocationSelected = () => {},
}) {
  const [availableMaps, setAvailableMaps] = useState([]);
  const [selectedMap, setSelectedMap] = useState(null);
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const mapMetadata = {
    'google-maps': {
      icon: '🗺️',
      name: 'Google Maps',
      description: 'Premium mapping with satellite view and advanced features',
      premium: true,
    },
    mapbox: {
      icon: '🛰️',
      name: 'Mapbox',
      description: 'Professional maps with real-time data and styling options',
      premium: false,
    },
    openstreetmap: {
      icon: '🌍',
      name: 'OpenStreetMap',
      description: 'Free and open community-driven maps',
      premium: false,
    },
  };

  // Load available maps for user
  useEffect(() => {
    const loadMaps = async () => {
      try {
        setLoading(true);
        // Determine available maps based on user type and premium status
        const availableMapsForUser = [];
        
        // Google Maps available only for premium users
        if (isPremium) {
          availableMapsForUser.push('google-maps');
        }
        
        // Mapbox available for builders and brokers (default)
        if (['builder', 'broker'].includes(userType)) {
          availableMapsForUser.push('mapbox');
        }
        
        // OpenStreetMap available for all users (free)
        availableMapsForUser.push('openstreetmap');
        
        // Default to mapbox if available, otherwise first available map
        let defaultMap = availableMapsForUser.includes('mapbox') 
          ? 'mapbox' 
          : availableMapsForUser[0];
        
        setAvailableMaps(availableMapsForUser);
        setSelectedMap(defaultMap);
        onMapSelected(defaultMap);
      } catch (err) {
        setError(`Failed to load maps: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadMaps();
  }, [userType, isPremium, onMapSelected]);

  // Handle address search and geocoding
  const handleAddressSearch = async (e) => {
    e.preventDefault();

    if (!address.trim()) {
      setError('Please enter an address');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/maps/geocode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          mapProvider: selectedMap,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setCoordinates({
          latitude: result.data.latitude,
          longitude: result.data.longitude,
          formattedAddress: result.data.formattedAddress,
        });
        onLocationSelected({
          latitude: result.data.latitude,
          longitude: result.data.longitude,
          formattedAddress: result.data.formattedAddress,
          mapProvider: selectedMap,
        });
      } else {
        setError(result.message || 'Address not found');
      }
    } catch (err) {
      setError(`Search failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle map selection change
  const handleMapChange = (map) => {
    setSelectedMap(map);
    onMapSelected(map);
    setCoordinates(null); // Reset coordinates when switching maps
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        📍 Select Map Provider for Your Property Location
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {loading && availableMaps.length === 0 ? (
        <div style={styles.loading}>Loading available maps...</div>
      ) : (
        <>
          {/* Map Options */}
          <div style={styles.mapSelector}>
            {availableMaps.map((mapName) => {
              const meta = mapMetadata[mapName];
              return (
                <div
                  key={mapName}
                  style={{
                    ...styles.mapOption,
                    ...(selectedMap === mapName
                      ? styles.mapOptionSelected
                      : {}),
                    ...(meta.premium ? styles.mapOptionPremium : {}),
                  }}
                  onClick={() => handleMapChange(mapName)}
                >
                  {meta.premium && !isPremium && (
                    <div style={styles.premiumBadge}>PREMIUM</div>
                  )}
                  <div style={styles.mapIcon}>{meta.icon}</div>
                  <div style={styles.mapName}>{meta.name}</div>
                  <div style={styles.mapDescription}>{meta.description}</div>
                  {selectedMap === mapName && (
                    <div style={{ marginTop: '10px', color: '#667eea' }}>
                      ✓ Selected
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Map Viewer and Address Search */}
          <div style={styles.mapViewer}>
            <form onSubmit={handleAddressSearch}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>
                  Property Address:
                </label>
                <input
                  type="text"
                  placeholder="Enter property address (e.g., 123 Main Street, Delhi)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={styles.searchBox}
                />
              </div>

              <div>
                <button
                  type="submit"
                  style={{ ...styles.button, ...styles.primaryButton }}
                  disabled={loading}
                >
                  {loading ? '🔍 Searching...' : '🔍 Find Location'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddress('');
                    setCoordinates(null);
                  }}
                  style={{ ...styles.button, ...styles.secondaryButton }}
                >
                  Clear
                </button>
              </div>
            </form>

            {/* Map Display Area */}
            <div
              style={styles.mapFrame}
              id="map-container"
              title={`Map powered by ${mapMetadata[selectedMap]?.name || 'Map Service'}`}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                  {mapMetadata[selectedMap]?.icon}
                </div>
                <div>
                  {selectedMap && mapMetadata[selectedMap]
                    ? `${mapMetadata[selectedMap].name} Map`
                    : 'Select a map'}
                </div>
                <div style={{ fontSize: '12px', marginTop: '10px' }}>
                  {coordinates
                    ? `Coordinates: ${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}`
                    : 'Enter an address to see location'}
                </div>
              </div>
            </div>

            {/* Coordinates Display */}
            {coordinates && (
              <div style={styles.coordinatesDisplay}>
                <div>
                  <strong>Location Found:</strong>
                </div>
                <div style={{ marginTop: '5px' }}>
                  <strong>Address:</strong> {coordinates.formattedAddress}
                </div>
                <div style={{ marginTop: '5px' }}>
                  <strong>Latitude:</strong> {coordinates.latitude.toFixed(6)}
                </div>
                <div style={{ marginTop: '5px' }}>
                  <strong>Longitude:</strong> {coordinates.longitude.toFixed(6)}
                </div>
                <div style={{ marginTop: '5px' }}>
                  <strong>Map Provider:</strong> {mapMetadata[selectedMap]?.name}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
