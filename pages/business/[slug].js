import Head from 'next/head';
import axios from 'axios';
import { FaWhatsapp, FaBuilding, FaMoneyBillWave, FaInfoCircle } from 'react-icons/fa';

const BusinessDetailsPage = ({ business, error }) => {
  if (error) {
    return <div style={{ textAlign: 'center', padding: '5rem', color: 'red' }}>Error: {error}</div>;
  }

  if (!business) {
    return <div style={{ textAlign: 'center', padding: '5rem' }}>Business not found.</div>;
  }

  return (
    <>
      <Head>
        <title>{business.name} | Business for {business.purpose} in {business.address.city}</title>
        <meta name="description" content={business.description.substring(0, 160)} />
        <meta property="og:title" content={business.name} />
        <meta property="og:description" content={business.description.substring(0, 160)} />
        {business.images && business.images[0] && <meta property="og:image" content={business.images[0]} />}
      </Head>

      <main style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
        {business.images && business.images[0] && (
          <img src={business.images[0]} alt={business.name} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '12px', marginBottom: '2rem' }} />
        )}
        
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{business.name}</h1>
        <p style={{ color: '#6b7280', fontSize: '1.2rem', marginTop: 0 }}>📍 {business.address.city}, {business.address.state}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', margin: '2rem 0' }}>
            <div style={{ background: '#f3f4f6', padding: '1.5rem', borderRadius: '8px' }}>
                <h4 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaBuilding /> Business Type</h4>
                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>{business.businessType}</p>
            </div>
            <div style={{ background: '#f3f4f6', padding: '1.5rem', borderRadius: '8px' }}>
                <h4 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaMoneyBillWave /> Turnover</h4>
                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>{business.turnover || 'Not Disclosed'}</p>
            </div>
            <div style={{ background: '#f3f4f6', padding: '1.5rem', borderRadius: '8px' }}>
                <h4 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaInfoCircle /> Purpose</h4>
                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500, textTransform: 'capitalize' }}>{business.purpose}</p>
            </div>
        </div>

        <div style={{ margin: '2rem 0' }}>
            <h3 style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Description</h3>
            <p style={{ lineHeight: 1.7, color: '#374151' }}>{business.description}</p>
        </div>

        {business.whatsIncluded && <div style={{ margin: '2rem 0' }}>
            <h3 style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>What's Included in the Deal?</h3>
            <p style={{ lineHeight: 1.7, color: '#374151' }}>{business.whatsIncluded}</p>
        </div>}

        {business.reasonForSelling && <div style={{ margin: '2rem 0' }}>
            <h3 style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Reason for Selling</h3>
            <p style={{ lineHeight: 1.7, color: '#374151' }}>{business.reasonForSelling}</p>
        </div>}

        <div style={{ textAlign: 'center', padding: '2rem', background: '#e0f2fe', borderRadius: '12px', marginTop: '3rem' }}>
            <h3 style={{ marginTop: 0 }}>Interested in this business?</h3>
            <p>Contact the owner directly on WhatsApp for a quick response.</p>
            <a href={`https://wa.me/91${business.phone}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#25d366', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '1.1rem' }}>
                <FaWhatsapp /> Contact Owner
            </a>
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps(context) {
  try {
    const { slug } = context.params;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const { data } = await axios.get(`${API_URL}/api/business/${slug}`);
    return { props: { business: data } };
  } catch (error) {
    console.error(`Error fetching business with slug '${context.params.slug}':`, error.message);
    return { props: { business: null, error: 'Failed to load business details.' } };
  }
}

export default BusinessDetailsPage;