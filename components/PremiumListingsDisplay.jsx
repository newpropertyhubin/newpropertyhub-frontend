import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const PremiumListingsDisplay = ({ brokerId, builderId, limit = 6 }) => {
  const [premiumProperties, setPremiumProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchPremiumProperties = useCallback(async () => {
    try {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // Map filters to backend params (Backend understands minPrice/maxPrice)
      let priceParams = {};
      if (filter === 'lowprice') priceParams = { maxPrice: 5000000 }; // Under 50L
      else if (filter === 'midprice') priceParams = { minPrice: 5000000, maxPrice: 10000000 }; // 50L - 1Cr
      else if (filter === 'luxury') priceParams = { minPrice: 10000000 }; // 1Cr+

      // Use the working /api/properties endpoint
      const response = await axios.get(`${API_URL}/api/properties`, {
        params: {
          brokerId,
          builderId,
          limit,
          ...priceParams
        },
      });

      if (response.data.properties) {
        setPremiumProperties(response.data.properties);
      }
    } catch (error) {
      console.error('Error fetching premium properties:', error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, filter, brokerId, builderId, limit, setPremiumProperties]);

  useEffect(() => {
    fetchPremiumProperties();
  }, [fetchPremiumProperties]);

  const styles = {
    container: {
      padding: '24px',
      backgroundColor: '#f9f9f9',
      borderRadius: '12px',
      marginBottom: '24px',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
      borderBottom: '2px solid #667eea',
      paddingBottom: '12px',
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#333',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    premiumBadge: {
      display: 'inline-block',
      backgroundColor: '#FFD700',
      color: '#333',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      marginLeft: '8px',
    },
    filterContainer: {
      display: 'flex',
      gap: '12px',
      marginBottom: '20px',
      flexWrap: 'wrap',
    },
    filterBtn: {
      padding: '8px 16px',
      borderRadius: '6px',
      border: '1px solid #ddd',
      backgroundColor: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.3s',
    },
    filterBtnActive: {
      backgroundColor: '#667eea',
      color: 'white',
      borderColor: '#667eea',
    },
    propertiesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px',
    },
    propertyCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      position: 'relative',
      border: '2px solid transparent',
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: '200px',
      overflow: 'hidden',
      backgroundColor: '#f0f0f0',
    },
    propertyImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.3s ease',
    },
    premiumBadgeOnCard: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      backgroundColor: '#FFD700',
      color: '#333',
      padding: '6px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    priceTag: {
      position: 'absolute',
      bottom: '12px',
      left: '12px',
      backgroundColor: 'rgba(102, 126, 234, 0.9)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '700',
    },
    content: {
      padding: '16px',
    },
    propertyTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '8px',
      lineHeight: '1.4',
    },
    location: {
      fontSize: '13px',
      color: '#666',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    details: {
      display: 'flex',
      justifyContent: 'space-around',
      marginBottom: '12px',
      paddingBottom: '12px',
      borderBottom: '1px solid #eee',
      fontSize: '13px',
      fontWeight: '500',
    },
    detailItem: {
      textAlign: 'center',
    },
    detailLabel: {
      color: '#999',
      fontSize: '11px',
      marginBottom: '4px',
    },
    detailValue: {
      color: '#333',
      fontWeight: '600',
    },
    amenities: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      marginBottom: '12px',
    },
    amenityTag: {
      backgroundColor: '#f0f0f0',
      color: '#666',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '11px',
    },
    actionButtons: {
      display: 'flex',
      gap: '10px',
    },
    btn: {
      flex: 1,
      padding: '10px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    contactBtn: {
      backgroundColor: '#667eea',
      color: 'white',
    },
    detailsBtn: {
      backgroundColor: 'white',
      color: '#667eea',
      border: '1px solid #667eea',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px',
      color: '#999',
    },
    loadingSpinner: {
      textAlign: 'center',
      padding: '40px',
      color: '#667eea',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingSpinner}>
          <p>⏳ Loading premium properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          ✨ Premium Properties
          <span style={styles.premiumBadge}>EXCLUSIVE</span>
        </h2>
      </div>

      <div style={styles.filterContainer}>
        {['all', 'lowprice', 'midprice', 'luxury'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...styles.filterBtn,
              ...(filter === f && styles.filterBtnActive),
            }}
          >
            {f === 'all'
              ? 'All Properties'
              : f === 'lowprice'
              ? 'Under ₹50L'
              : f === 'midprice'
              ? '₹50L - ₹1Cr'
              : '₹1Cr+'}
          </button>
        ))}
      </div>

      {premiumProperties.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No premium properties available at the moment</p>
        </div>
      ) : (
        <div style={styles.propertiesGrid}>
          {premiumProperties.map((property) => (
            <div key={property._id} style={styles.propertyCard}>
              <div style={styles.imageContainer}>
                <img
                  src={property.image || 'https://via.placeholder.com/300x200'}
                  alt={property.title}
                  style={styles.propertyImage}
                />
                <div style={styles.premiumBadgeOnCard}>
                  ⭐ PREMIUM
                </div>
                <div style={styles.priceTag}>
                  ₹{property.price > 10000000 ? (property.price / 10000000).toFixed(1) + 'Cr' : (property.price / 100000).toFixed(1) + 'L'}
                </div>
              </div>

              <div style={styles.content}>
                <h3 style={styles.propertyTitle}>{property.title}</h3>
                <div style={styles.location}>
                  📍 {property.location}
                </div>

                <div style={styles.details}>
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>BHK</div>
                    <div style={styles.detailValue}>{property.bhk || '2'}</div>
                  </div>
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>Size</div>
                    <div style={styles.detailValue}>{property.area || '1200'}sqft</div>
                  </div>
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>Rating</div>
                    <div style={styles.detailValue}>⭐{property.rating || '4.8'}</div>
                  </div>
                </div>

                <div style={styles.amenities}>
                  {(property.amenities || ['WiFi', 'Parking', 'Security']).slice(0, 3).map((amenity, idx) => (
                    <span key={idx} style={styles.amenityTag}>
                      {amenity}
                    </span>
                  ))}
                </div>

                <div style={styles.actionButtons}>
                  <button style={{ ...styles.btn, ...styles.contactBtn }}>
                    Contact Agent
                  </button>
                  <button style={{ ...styles.btn, ...styles.detailsBtn }}>
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PremiumListingsDisplay;
