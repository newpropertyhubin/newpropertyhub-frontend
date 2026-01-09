import Head from 'next/head';
import BookingComponent from '../components/BookingComponent';

export default function BanquetPage() {
  const banquets = [
    {
      id: '1',
      title: 'Grand Ballroom Delhi',
      image: 'https://via.placeholder.com/400x300?text=Grand+Ballroom',
      location: 'Connaught Place, New Delhi',
      capacity: '500-2000 guests',
      price: 50000,
      amenities: ['AC', 'Parking', 'Catering', 'Sound System', 'Stage'],
      description: 'Luxurious banquet hall perfect for weddings and corporate events',
    },
    {
      id: '2',
      title: 'Royal Banquet - Gurgaon',
      image: 'https://via.placeholder.com/400x300?text=Royal+Banquet',
      location: 'Sector 31, Gurgaon',
      capacity: '300-1000 guests',
      price: 40000,
      amenities: ['AC', 'Kitchen', 'WiFi', 'Valet Parking', 'Multiple Halls'],
      description: 'Modern banquet with multiple halls for different events',
    },
    {
      id: '3',
      title: 'Elegant Events Hall',
      image: 'https://via.placeholder.com/400x300?text=Elegant+Events',
      location: 'Noida, Uttar Pradesh',
      capacity: '200-800 guests',
      price: 30000,
      amenities: ['AC', 'Parking', 'Catering Available', 'Decorations'],
      description: 'Affordable banquet hall for weddings and parties',
    },
  ];

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
      backgroundColor: '#f9f9f9',
      minHeight: '100vh',
    },
    header: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: 'white',
      padding: '40px',
      borderRadius: '12px',
      marginBottom: '32px',
      textAlign: 'center',
    },
    headerTitle: {
      fontSize: '36px',
      fontWeight: '700',
      marginBottom: '8px',
    },
    headerSubtitle: {
      fontSize: '16px',
      opacity: '0.9',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '24px',
      marginBottom: '40px',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
    },
    image: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
    },
    cardContent: {
      padding: '20px',
    },
    title: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#333',
      marginBottom: '8px',
    },
    location: {
      fontSize: '13px',
      color: '#666',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    capacity: {
      fontSize: '13px',
      color: '#666',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    price: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#f5576c',
      marginBottom: '12px',
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
    description: {
      fontSize: '13px',
      color: '#666',
      marginBottom: '16px',
    },
    bookBtn: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#f5576c',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
  };

  return (
    <>
      <Head>
        <title>Banquet Halls & Event Venues - NewPropertyHub</title>
        <meta name="description" content="Book the perfect banquet hall for your wedding or event" />
      </Head>

      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>💒 Banquet Halls & Event Venues</h1>
          <p style={styles.headerSubtitle}>Perfect venues for weddings, parties, and corporate events</p>
        </div>

        <div style={styles.grid}>
          {banquets.map((banquet) => (
            <div key={banquet.id} style={styles.card}>
              <img src={banquet.image} alt={banquet.title} style={styles.image} />
              <div style={styles.cardContent}>
                <h3 style={styles.title}>{banquet.title}</h3>
                <div style={styles.location}>📍 {banquet.location}</div>
                <div style={styles.capacity}>👥 {banquet.capacity}</div>
                <div style={styles.price}>
                  ₹{banquet.price}/day
                </div>
                <div style={styles.amenities}>
                  {banquet.amenities.map((amenity, idx) => (
                    <span key={idx} style={styles.amenityTag}>{amenity}</span>
                  ))}
                </div>
                <p style={styles.description}>{banquet.description}</p>
                <button style={styles.bookBtn}>
                  📅 Check Availability
                </button>
              </div>
            </div>
          ))}
        </div>

        <BookingComponent 
          propertyId="banquet-1"
          propertyTitle="Banquet Hall"
          propertyType="banquet"
          pricePerNight={50000}
        />
      </div>
    </>
  );
}