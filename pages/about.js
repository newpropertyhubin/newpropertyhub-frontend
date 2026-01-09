import Head from 'next/head';

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>About PropertyHub - India's Premier Real Estate Platform</title>
        <meta name="description" content="PropertyHub is India's leading property marketplace connecting buyers, sellers, and investors." />
      </Head>

      <main style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '2rem' }}>
        {/* Hero Section */}
        <section style={{ textAlign: 'center', paddingBottom: '3rem', borderBottom: '1px solid var(--border)' }}>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--dark)', marginBottom: '1rem' }}>About NewPropertyHub.in</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--muted)', maxWidth: '600px', margin: '0 auto' }}>
            India's most trusted platform for finding, listing, and managing properties with complete transparency and ease.
          </p>
        </section>

        {/* Mission & Vision */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', margin: '3rem 0', padding: '2rem 0' }}>
          <div style={{ background: 'var(--card)', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--accent)', marginBottom: '1rem' }}>🎯 Our Mission</h3>
            <p style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              To revolutionize the real estate industry by providing a transparent, efficient, and user-friendly platform that connects property seekers with their dream homes and investment opportunities.
            </p>
          </div>
          <div style={{ background: 'var(--card)', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--accent)', marginBottom: '1rem' }}>👁️ Our Vision</h3>
            <p style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              To become the most trusted real estate marketplace in India, empowering millions with accurate information, expert advice, and secure transactions for all property needs.
            </p>
          </div>
          <div style={{ background: 'var(--card)', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--accent)', marginBottom: '1rem' }}>💡 Our Values</h3>
            <p style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              Transparency, integrity, innovation, and customer-centricity. We believe in building lasting relationships based on trust and delivering exceptional value to every user.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #0056b3 100%)', color: 'white', padding: '3rem 2rem', borderRadius: '12px', margin: '3rem 0' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>PropertyHub by Numbers</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>10,000+</div>
              <p style={{ opacity: 0.95 }}>Active Properties</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>50,000+</div>
              <p style={{ opacity: 0.95 }}>Happy Customers</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>25+</div>
              <p style={{ opacity: 0.95 }}>Cities Across India</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>500+</div>
              <p style={{ opacity: 0.95 }}>Verified Brokers</p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section style={{ margin: '3rem 0' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--dark)', marginBottom: '2rem', textAlign: 'center' }}>Why Choose PropertyHub?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔍</div>
              <h3 style={{ color: 'var(--dark)', marginBottom: '0.75rem' }}>Verified Listings</h3>
              <p style={{ color: 'var(--muted)' }}>All properties are verified and legitimate, with detailed information and authentic photos.</p>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>💰</div>
              <h3 style={{ color: 'var(--dark)', marginBottom: '0.75rem' }}>Best Prices</h3>
              <p style={{ color: 'var(--muted)' }}>Compare properties across multiple options and find the best deals in your budget.</p>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📱</div>
              <h3 style={{ color: 'var(--dark)', marginBottom: '0.75rem' }}>Easy to Use</h3>
              <p style={{ color: 'var(--muted)' }}>Our user-friendly interface makes property hunting simple and stress-free.</p>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🛡️</div>
              <h3 style={{ color: 'var(--dark)', marginBottom: '0.75rem' }}>Secure Transactions</h3>
              <p style={{ color: 'var(--muted)' }}>Your data and transactions are protected with industry-leading security measures.</p>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🤝</div>
              <h3 style={{ color: 'var(--dark)', marginBottom: '0.75rem' }}>Expert Support</h3>
              <p style={{ color: 'var(--muted)' }}>Our team is available 24/7 to help you with any questions or concerns.</p>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📊</div>
              <h3 style={{ color: 'var(--dark)', marginBottom: '0.75rem' }}>Market Insights</h3>
              <p style={{ color: 'var(--muted)' }}>Get latest trends, price data, and expert analysis to make informed decisions.</p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section style={{ background: 'var(--bg)', padding: '3rem 2rem', borderRadius: '12px', textAlign: 'center', margin: '3rem 0' }}>
          <h2 style={{ color: 'var(--dark)', marginBottom: '1rem' }}>Have Questions?</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>Our support team is here to help you 24/7</p>
          <a href="https://wa.me/919876543210" style={{ background: 'var(--accent)', color: 'white', padding: '12px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem', display: 'inline-block' }}>
            Contact Us
          </a>
        </section>
      </main>
    </>
  );
};

export default AboutPage;