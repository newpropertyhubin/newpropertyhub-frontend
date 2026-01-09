import React from 'react';
import Link from 'next/link';

const PremiumListingComponent = ({ properties = [], builderInfo = null }) => {
  const styles = {
    container: {
      backgroundColor: '#fff8f0',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '32px',
      border: '2px solid #ffd700',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px',
      paddingBottom: '16px',
      borderBottom: '2px solid #ffd700',
    },
    headerIcon: {
      fontSize: '32px',
    },
    headerText: {
      flex: 1,
    },
    headerTitle: {
      margin: '0 0 4px 0',
      fontSize: '20px',
      fontWeight: '700',
      color: '#333',
    },
    headerSubtitle: {
      margin: '0',
      fontSize: '14px',
      color: '#666',
    },
    badge: {
      backgroundColor: '#ffd700',
      color: '#333',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '16px',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      border: '2px solid transparent',
    },
    cardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 16px rgba(102, 126, 234, 0.2)',
      borderColor: '#ffd700',
    },
    image: {
      width: '100%',
      height: '180px',
      objectFit: 'cover',
      position: 'relative',
    },
    premiumBadge: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      backgroundColor: '#ffd700',
      color: '#333',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      zIndex: 10,
    },
    content: {
      padding: '16px',
    },
    title: {
      margin: '0 0 8px 0',
      fontSize: '16px',
      fontWeight: '600',
      color: '#333',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    price: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#667eea',
      margin: '8px 0',
    },
    details: {
      display: 'flex',
      gap: '12px',
      fontSize: '12px',
      color: '#666',
      margin: '8px 0',
    },
    detailItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    features: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      margin: '8px 0',
    },
    featureBadge: {
      backgroundColor: '#f0f0f0',
      color: '#333',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '11px',
    },
    footer: {
      display: 'flex',
      gap: '8px',
      marginTop: '12px',
    },
    button: {
      flex: 1,
      padding: '8px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    primaryBtn: {
      backgroundColor: '#667eea',
      color: 'white',
    },
    secondaryBtn: {
      backgroundColor: '#f0f0f0',
      color: '#333',
      border: '1px solid #ddd',
    },
    broker: {
      backgroundColor: '#f9f9f9',
      padding: '12px',
      borderRadius: '6px',
      marginTop: '12px',
      borderTop: '1px solid #eee',
    },
    brokerHeader: {
      fontSize: '12px',
      color: '#999',
      marginBottom: '6px',
      fontWeight: '600',
    },
    brokerInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    brokerImage: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      objectFit: 'cover',
    },
    brokerName: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#333',
    },
    brokerContact: {
      fontSize: '11px',
      color: '#666',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#999',
    },
  };

  const Property = ({ prop, onHover, onLeave }) => (
    <div
      style={styles.card}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div style={{ position: 'relative' }}>
        <img
          src={prop.image || 'https://via.placeholder.com/280x180?text=Property'}
          alt={prop.title}
          style={styles.image}
        />
        <div style={styles.premiumBadge}>⭐ PREMIUM</div>
      </div>

      <div style={styles.content}>
        <h3 style={styles.title}>{prop.title}</h3>
        <div style={styles.price}>
          ₹{(prop.price / 100000).toFixed(1)}L
        </div>

        <div style={styles.details}>
          {prop.bhk && (
            <div style={styles.detailItem}>
              🛏️ {prop.bhk}
            </div>
          )}
          {prop.area && (
            <div style={styles.detailItem}>
              📐 {prop.area} sqft
            </div>
          )}
          {prop.location && (
            <div style={styles.detailItem}>
              📍 {prop.location}
            </div>
          )}
        </div>

        {prop.features && prop.features.length > 0 && (
          <div style={styles.features}>
            {prop.features.slice(0, 3).map((feature, idx) => (
              <span key={idx} style={styles.featureBadge}>
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* Broker Info */}
        {prop.broker && (
          <div style={styles.broker}>
            <div style={styles.brokerHeader}>Listed by</div>
            <div style={styles.brokerInfo}>
              <img
                src={prop.broker.image || 'https://via.placeholder.com/32x32?text=Broker'}
                alt={prop.broker.name}
                style={styles.brokerImage}
              />
              <div>
                <div style={styles.brokerName}>{prop.broker.name}</div>
                <div style={styles.brokerContact}>{prop.broker.contact}</div>
              </div>
            </div>
          </div>
        )}

        <div style={styles.footer}>
          <Link href={`/property-details/${prop.id}`}>
            <button
              style={{ ...styles.button, ...styles.primaryBtn }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#5568d3';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#667eea';
              }}
            >
              View Details
            </button>
          </Link>
          <button
            style={{ ...styles.button, ...styles.secondaryBtn }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e0e0e0';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f0f0f0';
            }}
          >
            💬 Contact
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerIcon}>⭐</div>
        <div style={styles.headerText}>
          <h2 style={styles.headerTitle}>
            {builderInfo ? `${builderInfo.name} - Premium Listings` : 'Premium Properties'}
          </h2>
          <p style={styles.headerSubtitle}>
            Handpicked premium properties for discerning buyers
          </p>
        </div>
        <span style={styles.badge}>FEATURED</span>
      </div>

      {/* Properties Grid */}
      {properties && properties.length > 0 ? (
        <div style={styles.grid}>
          {properties.map((prop, idx) => (
            <Property
              key={idx}
              prop={prop}
              onHover={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(102, 126, 234, 0.2)';
                e.currentTarget.style.borderColor = '#ffd700';
              }}
              onLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            />
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <p>No premium listings at this moment.</p>
          <p style={{ fontSize: '12px' }}>Check back soon for updated properties!</p>
        </div>
      )}
    </div>
  );
};

export default PremiumListingComponent;
