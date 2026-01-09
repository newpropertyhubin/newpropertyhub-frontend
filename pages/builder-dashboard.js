import Head from 'next/head';
import Link from 'next/link';
import { useRequireAuth } from '../hooks/useAuth';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BuilderDashboardPage = () => {
  const { user, loading: authLoading, authorized } = useRequireAuth(['Builder', 'builder']);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBuilderStats = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${API_URL}/api/dashboard/builder`, config);
      if (data.success) {
        setStats(data.data);
      } else {
        setError('Could not load dashboard data.');
      }
    } catch (err) {
      setError('Failed to fetch dashboard statistics.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, setLoading, setStats, setError]); // Add user and state setters

  useEffect(() => {
    if (authorized) {
      fetchBuilderStats();
    }
  }, [authorized, fetchBuilderStats]);

  if (authLoading || loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading Dashboard...</div>;
  if (!authorized) return null;

  return (
    <>
      <Head>
        <title>Builder Dashboard - NewPropertyHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>🏗️ Builder Dashboard</h1>
            <p style={{ color: '#666', margin: 0 }}>Welcome, {user.name}. Manage your projects, sales, and updates.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/index-crm">
                <button style={{ padding: '0.8rem 1.5rem', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                👥 Open CRM
                </button>
            </Link>
            <Link href="/add-property">
                <button style={{ padding: '0.8rem 1.5rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                + Add New Project
                </button>
            </Link>
          </div>
        </div>

        {error && <p style={{color: 'red', background: '#ffebeb', padding: '1rem', borderRadius: '8px'}}>{error}</p>}

        {stats && (
          <>
            {/* Wallet & CRM Section */}
            <section style={{ marginBottom: '2rem', background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>💳 Map Credits & Wallet</h3>
                    <p style={{ margin: 0, color: '#666' }}>Balance used for map views on your properties.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: stats.mapTokens < 20 ? '#dc2626' : '#16a34a' }}>
                        🪙 {stats.mapTokens?.toLocaleString() || 0}
                    </div>
                    <button onClick={() => alert("Token recharge coming soon!")} style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
                        ⚡ Buy Tokens
                    </button>
                </div>
            </section>

            {/* Key Metrics */}
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>📊 Project Overview</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Projects</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.totalProjects}</div>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Under Construction</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.underConstructionProjects}</div>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Ready to Move</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.readyToMoveProjects}</div>
                </div>
              </div>
            </section>

            {/* Inventory & Sales */}
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>📦 Inventory & Sales</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Units</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2563eb' }}>{stats.inventory.totalUnits}</div>
                </div>
                <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>Units Sold</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#16a34a' }}>{stats.inventory.soldUnits}</div>
                </div>
                <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>Occupancy Rate</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f59e0b' }}>{stats.inventory.occupancyRate}%</div>
                </div>
                <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Revenue (Offline)</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#16a34a' }}>₹{(stats.sales.totalRevenue / 100000).toFixed(1)}L</div>
                </div>
              </div>
            </section>

            {/* Recent Leads / Inquiries (New Feature) */}
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>👥 Recent Interested Customers (Leads)</h2>
              {stats.recentLeads && stats.recentLeads.length > 0 ? (
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                  {stats.recentLeads.map((lead, index) => (
                    <div key={index} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1f2937' }}>{lead.name}</div>
                      <div style={{ color: '#2563eb', margin: '5px 0' }}>📞 {lead.phone}</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>Interested in: <b>{lead.projectName}</b></div>
                      <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '10px' }}>{new Date(lead.date).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ background: '#f0f9ff', padding: '1.5rem', borderRadius: '8px', color: '#0369a1', border: '1px solid #bae6fd' }}>No new leads yet. Share your project links to get more inquiries!</p>
              )}
            </section>

            {/* Recent Updates */}
            <section>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>🔔 Recent Project Updates</h2>
              {stats.recentUpdates && stats.recentUpdates.length > 0 ? (
                <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                  {stats.recentUpdates.map(update => (
                    <div key={update._id || update.title} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                      <p style={{ fontWeight: '600', margin: 0 }}>{update.title} <span style={{ color: '#666', fontWeight: 'normal' }}>- {update.projectName}</span></p>
                      <p style={{ color: '#666', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>{new Date(update.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>No recent updates posted. Go to your project and post an update to notify interested users.</p>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
};

export default BuilderDashboardPage;
