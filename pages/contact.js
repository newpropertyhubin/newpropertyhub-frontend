import Head from 'next/head';
import { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [formResponse, setFormResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormResponse('Sending...');
    
    setTimeout(() => {
      setFormResponse('✅ Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      <Head>
        <title>Contact NewPropertyHub.in - Get in Touch</title>
        <meta name="description" content="Contact NewPropertyHub team for any questions or support related to properties." />
      </Head>

      <main style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '2rem' }}>
        {/* Hero Section */}
        <section style={{ textAlign: 'center', paddingBottom: '3rem', borderBottom: '1px solid var(--border)' }}>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--dark)', marginBottom: '1rem' }}>Contact NewPropertyHub.in</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--muted)', maxWidth: '600px', margin: '0 auto' }}>
            Have a question? We'd love to hear from you. Reach out to our team anytime.
          </p>
        </section>

        {/* Contact Methods */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', margin: '3rem 0', padding: '2rem 0' }}>
          <div style={{ background: 'var(--card)', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📧</div>
            <h3 style={{ color: 'var(--dark)', marginBottom: '0.75rem' }}>Email</h3>
            <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>newpropertyhub.in@gmail.com</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>We'll respond within 24 hours</p>
          </div>
          <div style={{ background: 'var(--card)', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📱</div>
            <h3 style={{ color: 'var(--dark)', marginBottom: '0.75rem' }}>Phone</h3>
            <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>+91 7828289433</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Available 9 AM - 6 PM IST</p>
          </div>
          <div style={{ background: 'var(--card)', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💬</div>
            <h3 style={{ color: 'var(--dark)', marginBottom: '0.75rem' }}>WhatsApp</h3>
            <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>Chat with us instantly</p>
            <a href="https://wa.me/7828289433" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold' }}>Start Chat →</a>
          </div>
        </section>

        {/* Contact Form */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', margin: '3rem 0', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--dark)', marginBottom: '1.5rem' }}>Send us a Message</h2>
            <form onSubmit={handleSubmit} style={{ background: 'var(--card)', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--dark)' }}>Full Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleFormChange} 
                  required 
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '1rem' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--dark)' }}>Email Address *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleFormChange} 
                  required 
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '1rem' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--dark)' }}>Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleFormChange} 
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '1rem' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="subject" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--dark)' }}>Subject *</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleFormChange} 
                  required 
                  placeholder="How can we help?" 
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '1rem' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--dark)' }}>Message *</label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleFormChange} 
                  required 
                  rows="5"
                  placeholder="Tell us more about your inquiry..."
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  width: '100%', 
                  background: loading ? '#ccc' : 'var(--accent)', 
                  color: '#fff', 
                  padding: '0.85rem', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontWeight: 'bold', 
                  fontSize: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>

              {formResponse && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  borderRadius: '8px', 
                  background: formResponse.includes('✅') ? '#e8f5e9' : '#fff3cd',
                  color: formResponse.includes('✅') ? '#2e7d32' : '#856404',
                  textAlign: 'center'
                }}>
                  {formResponse}
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--dark)', marginBottom: '1.5rem' }}>Office Hours</h2>
            <div style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
              <p style={{ marginBottom: '0.75rem' }}><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM IST</p>
              <p style={{ marginBottom: '0.75rem' }}><strong>Saturday:</strong> 10:00 AM - 4:00 PM IST</p>
              <p><strong>Sunday:</strong> 10:00 AM - 2:00 PM IST (Emergency Only)</p>
            </div>

            <h3 style={{ color: 'var(--dark)', marginBottom: '1rem' }}>Our Address</h3>
            <div style={{ background: 'var(--card)', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow)', marginBottom: '2rem' }}>
              <p style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
                NewPropertyHub.in<br/>
                Online Real Estate Platform<br/>
                India
              </p>
            </div>

            <h3 style={{ color: 'var(--dark)', marginBottom: '1rem' }}>Quick Links</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.75rem' }}><a href="/property" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Browse Properties</a></li>
              <li style={{ marginBottom: '0.75rem' }}><a href="/add-property" style={{ color: 'var(--accent)', textDecoration: 'none' }}>List Property</a></li>
              <li style={{ marginBottom: '0.75rem' }}><a href="/about" style={{ color: 'var(--accent)', textDecoration: 'none' }}>About Us</a></li>
              <li style={{ marginBottom: '0.75rem' }}><a href="/help" style={{ color: 'var(--accent)', textDecoration: 'none' }}>FAQ</a></li>
            </ul>
          </div>
        </section>

        {/* Map Section */}
        <section style={{ margin: '3rem 0' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--dark)', marginBottom: '1.5rem' }}>Find Us on Map</h2>
          <div style={{ background: 'var(--bg)', borderRadius: '12px', overflow: 'hidden', height: '400px' }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.8149381381666!2d77.20623!3d28.612893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2cc8c8c8c8d%3A0x8c8c8c8c8c8c8c8c!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1234567890" 
              width="100%" 
              height="100%" 
              style={{ border: 'none' }}
              allowFullScreen="" 
              loading="lazy"
            />
          </div>
        </section>
      </main>
    </>
  );
};

export default ContactPage;