import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRequireAuth } from '../../hooks/useAuth';
import Link from 'next/link';

const AdminSettingsPage = () => {
  const { user, loading: authLoading, authorized } = useRequireAuth(['admin']);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchSettings = useCallback(async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${API_URL}/api/admin/settings`, config);
      setSettings(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching settings:", error);
      setLoading(false);
    }
  }, [user, API_URL]);

  useEffect(() => {
    if (authorized) {
      fetchSettings();
    }
  }, [authorized, fetchSettings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Saving...');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${API_URL}/api/admin/settings`, settings, config);
      setMessage('✅ Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error updating settings:", error);
      setMessage('❌ Failed to update settings.');
    }
  };

  const handleChange = (section, field, value, subField = null) => {
    setSettings(prev => {
      if (subField) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: {
              ...prev[section][field],
              [subField]: Number(value)
            }
          }
        };
      }
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: Number(value)
        }
      };
    });
  };

  if (authLoading || loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Admin Settings...</div>;
  if (!authorized) return null;

  return (
    <>
      <Head>
        <title>Admin Settings - NewPropertyHub</title>
      </Head>

      <main style={{ maxWidth: '1000px', margin: '2rem auto', padding: '2rem', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ margin: 0 }}>⚙️ Platform Settings</h1>
          <Link href="/admin-dashboard" style={{ color: '#2563eb', textDecoration: 'none' }}>← Back to Dashboard</Link>
        </div>

        {message && <div style={{ padding: '1rem', background: message.includes('✅') ? '#dcfce7' : '#fee2e2', borderRadius: '8px', marginBottom: '1rem' }}>{message}</div>}

        <form onSubmit={handleSubmit}>
          
          {/* --- Token System Settings --- */}
          <section style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '2rem' }}>
            <h2 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>🪙 Token & Map System</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Initial Free Tokens (Registration)</label>
                <input type="number" value={settings.tokenSystem.initialTokens} onChange={(e) => handleChange('tokenSystem', 'initialTokens', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Monthly Free Allocation</label>
                <input type="number" value={settings.tokenSystem.monthlyAllocation} onChange={(e) => handleChange('tokenSystem', 'monthlyAllocation', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Free Period (Months)</label>
                <input type="number" value={settings.tokenSystem.gracePeriodMonths} onChange={(e) => handleChange('tokenSystem', 'gracePeriodMonths', e.target.value)} style={inputStyle} />
                <small style={{ color: '#666' }}>How long users get monthly free tokens.</small>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Token Price (₹)</label>
                <input type="number" value={settings.tokenSystem.tokenPrice} onChange={(e) => handleChange('tokenSystem', 'tokenPrice', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Your Commission (%)</label>
                <input type="number" value={settings.tokenSystem.commissionPercentage} onChange={(e) => handleChange('tokenSystem', 'commissionPercentage', e.target.value)} style={inputStyle} />
                <small style={{ color: '#666' }}>Margin added to token cost.</small>
              </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', marginTop: '1.5rem' }}>Cost Per View (In Tokens)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Static Map</label>
                <input type="number" value={settings.tokenSystem.costPerView.static} onChange={(e) => handleChange('tokenSystem', 'costPerView', e.target.value, 'static')} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Interactive Map</label>
                <input type="number" value={settings.tokenSystem.costPerView.dynamic} onChange={(e) => handleChange('tokenSystem', 'costPerView', e.target.value, 'dynamic')} style={inputStyle} />
              </div>
            </div>
          </section>

          {/* --- Upload Limits --- */}
          <section style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '2rem' }}>
            <h2 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>📤 Upload Limits (Packages)</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#2563eb' }}>Regular User</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label>Free Images Limit</label>
                  <input type="number" value={settings.uploadLimits.user.free.images} onChange={(e) => handleChange('uploadLimits', 'user', e.target.value, 'free.images')} style={inputStyle} />
                </div>
                <div>
                  <label>Premium Images Limit</label>
                  <input type="number" value={settings.uploadLimits.user.premium.images} onChange={(e) => handleChange('uploadLimits', 'user', e.target.value, 'premium.images')} style={inputStyle} />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#2563eb' }}>Broker</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label>Free Images Limit</label>
                  <input type="number" value={settings.uploadLimits.broker.free.images} onChange={(e) => handleChange('uploadLimits', 'broker', e.target.value, 'free.images')} style={inputStyle} />
                </div>
                <div>
                  <label>Premium Images Limit</label>
                  <input type="number" value={settings.uploadLimits.broker.premium.images} onChange={(e) => handleChange('uploadLimits', 'broker', e.target.value, 'premium.images')} style={inputStyle} />
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ color: '#2563eb' }}>Builder</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label>Free Images Limit</label>
                  <input type="number" value={settings.uploadLimits.builder.free.images} onChange={(e) => handleChange('uploadLimits', 'builder', e.target.value, 'free.images')} style={inputStyle} />
                </div>
                <div>
                  <label>Premium Images Limit</label>
                  <input type="number" value={settings.uploadLimits.builder.premium.images} onChange={(e) => handleChange('uploadLimits', 'builder', e.target.value, 'premium.images')} style={inputStyle} />
                </div>
              </div>
            </div>
          </section>

          {/* --- Ad Rates --- */}
          <section style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '2rem' }}>
            <h2 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>📢 Ad Rates (Per Day)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Featured Listing (₹)</label>
                <input type="number" value={settings.adRates.featuredPropertyPerDay} onChange={(e) => handleChange('adRates', 'featuredPropertyPerDay', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Banner Ad (₹)</label>
                <input type="number" value={settings.adRates.bannerAdPerDay} onChange={(e) => handleChange('adRates', 'bannerAdPerDay', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Social Media Post (₹)</label>
                <input type="number" value={settings.adRates.socialMediaPost} onChange={(e) => handleChange('adRates', 'socialMediaPost', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Verification Fee (Blue Tick) (₹)</label>
                <input type="number" value={settings.verificationFees.blueTick} onChange={(e) => handleChange('verificationFees', 'blueTick', e.target.value)} style={inputStyle} />
              </div>
            </div>
          </section>

          <button 
            type="submit" 
            style={{ 
              background: '#2563eb', 
              color: 'white', 
              padding: '1rem 2rem', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '1.1rem', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Save All Settings
          </button>
        </form>
      </main>
    </>
  );
};

const inputStyle = {
  width: '100%',
  padding: '0.8rem',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '1rem'
};

export default AdminSettingsPage;
