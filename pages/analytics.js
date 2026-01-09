import Head from 'next/head';
import Link from 'next/link';
import React, { useState } from 'react';

const AnalyticsDashboardPage = () => {
  const [timeframe, setTimeframe] = useState('month');

  const [analytics] = useState({
    propertyViews: 45230,
    propertyViewsTrend: '+18%',
    userRegistrations: 1240,
    registrationsTrend: '+12%',
    brokerConversions: 234,
    conversionsTrend: '+25%',
    totalRevenue: 4525000,
    revenueTrend: '+32%',
  });

  const [topProperties] = useState([
    { id: 1, name: '3BHK Luxury Villa in Pune', views: 2345, inquiries: 123, conversions: 8, avgTime: '2.3 days' },
    { id: 2, name: '2BHK Flat in Mumbai', views: 1987, inquiries: 98, conversions: 6, avgTime: '1.8 days' },
    { id: 3, name: 'Commercial Space in Bangalore', views: 1654, inquiries: 78, conversions: 5, avgTime: '3.2 days' },
    { id: 4, name: 'Farm House in Delhi', views: 1432, inquiries: 65, conversions: 4, avgTime: '2.8 days' },
    { id: 5, name: '4BHK Villa in Hyderabad', views: 1213, inquiries: 54, conversions: 3, avgTime: '4.1 days' },
  ]);

  const [brokerPerformance] = useState([
    { id: 1, name: 'Rajesh Kumar', properties: 45, views: 12345, conversions: 45, revenue: 1125000, rating: 4.8 },
    { id: 2, name: 'Priya Singh', properties: 38, views: 10234, conversions: 38, revenue: 950000, rating: 4.6 },
    { id: 3, name: 'Amit Patel', properties: 32, views: 8765, conversions: 32, revenue: 800000, rating: 4.5 },
    { id: 4, name: 'Neha Sharma', properties: 28, views: 7234, conversions: 25, revenue: 625000, rating: 4.3 },
    { id: 5, name: 'Vikram Singh', properties: 25, views: 6123, conversions: 20, revenue: 500000, rating: 4.1 },
  ]);

  const [userBehavior] = useState({
    avgSessionDuration: '8m 32s',
    sessionsTrend: '+15%',
    bounceRate: '32.4%',
    bounceTrend: '-3.2%',
    conversionRate: '3.2%',
    conversionTrend: '+0.8%',
    mobileTraffic: '68%',
    mobileTrend: '+5%',
  });

  const [revenueBreakdown] = useState([
    { source: 'Broker Subscriptions', amount: 1800000, percentage: 40 },
    { source: 'Featured Listings', amount: 1125000, percentage: 25 },
    { source: 'Premium Memberships', amount: 900000, percentage: 20 },
    { source: 'Advertising', amount: 700000, percentage: 15 },
  ]);

  const [topCities] = useState([
    { city: 'Mumbai', properties: 1245, views: 45230, inquiries: 2345, conversions: 234 },
    { city: 'Bangalore', properties: 987, views: 38765, inquiries: 1987, conversions: 198 },
    { city: 'Delhi', properties: 856, views: 34567, inquiries: 1765, conversions: 176 },
    { city: 'Pune', properties: 743, views: 29876, inquiries: 1534, conversions: 153 },
    { city: 'Hyderabad', properties: 654, views: 26543, inquiries: 1345, conversions: 134 },
  ]);

  return (
    <>
      <Head>
        <title>Advanced Analytics - NewPropertyHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>📈 Advanced Analytics</h1>
              <p style={{ color: '#666', margin: 0 }}>Business intelligence and performance tracking</p>
            </div>
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value)}
              style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.95rem' }}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>📊 Key Performance Indicators</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>Property Views</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{analytics.propertyViews.toLocaleString()}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>↑ {analytics.propertyViewsTrend}</div>
            </div>
            
            <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>New Users</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{analytics.userRegistrations.toLocaleString()}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>↑ {analytics.registrationsTrend}</div>
            </div>
            
            <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>Conversions</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{analytics.brokerConversions}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>↑ {analytics.conversionsTrend}</div>
            </div>
            
            <div style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>Total Revenue</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>₹{(analytics.totalRevenue / 100000).toFixed(1)}L</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>↑ {analytics.revenueTrend}</div>
            </div>
          </div>
        </section>

        {/* User Behavior */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>👥 User Behavior Analysis</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Avg Session Duration</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2563eb' }}>{userBehavior.avgSessionDuration}</div>
              <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>{userBehavior.sessionsTrend}</div>
            </div>
            
            <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Bounce Rate</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ef4444' }}>{userBehavior.bounceRate}</div>
              <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>{userBehavior.bounceTrend}</div>
            </div>
            
            <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Conversion Rate</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#22c55e' }}>{userBehavior.conversionRate}</div>
              <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>{userBehavior.conversionTrend}</div>
            </div>
            
            <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Mobile Traffic</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2563eb' }}>{userBehavior.mobileTraffic}</div>
              <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>{userBehavior.mobileTrend}</div>
            </div>
          </div>
        </section>

        {/* Top Properties */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>🔥 Top Performing Properties</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Property</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Views</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Inquiries</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Conversions</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Conversion Rate</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Time to Sale</th>
                </tr>
              </thead>
              <tbody>
                {topProperties.map((prop) => (
                  <tr key={prop.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{prop.name}</td>
                    <td style={{ padding: '1rem' }}>{prop.views.toLocaleString()}</td>
                    <td style={{ padding: '1rem' }}>{prop.inquiries}</td>
                    <td style={{ padding: '1rem', color: '#22c55e', fontWeight: '600' }}>{prop.conversions}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ background: '#dcfce7', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500' }}>
                        {Math.round((prop.conversions / prop.inquiries) * 100)}%
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#666' }}>{prop.avgTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Top Brokers */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>⭐ Top Performing Brokers</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Broker</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Properties</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Views</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Conversions</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Revenue</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {brokerPerformance.map((broker) => (
                  <tr key={broker.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{broker.name}</td>
                    <td style={{ padding: '1rem' }}>{broker.properties}</td>
                    <td style={{ padding: '1rem' }}>{broker.views.toLocaleString()}</td>
                    <td style={{ padding: '1rem', color: '#22c55e', fontWeight: '600' }}>{broker.conversions}</td>
                    <td style={{ padding: '1rem', fontWeight: '600' }}>₹{(broker.revenue / 100000).toFixed(1)}L</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ background: '#fef3c7', color: '#92400e', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500' }}>
                        ⭐ {broker.rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Revenue Breakdown */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>💰 Revenue Breakdown</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {revenueBreakdown.map((item, idx) => (
              <div key={idx} style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '500' }}>{item.source}</h3>
                  <span style={{ background: '#dbeafe', color: '#1e40af', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500' }}>
                    {item.percentage}%
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                  <div style={{ width: `${item.percentage}%`, height: '100%', background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}></div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>₹{(item.amount / 100000).toFixed(2)}L</div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Cities */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>🏙️ Performance by City</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>City</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Properties</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Views</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Inquiries</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Conversions</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Market Share</th>
                </tr>
              </thead>
              <tbody>
                {topCities.map((city) => (
                  <tr key={city.city} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{city.city}</td>
                    <td style={{ padding: '1rem' }}>{city.properties}</td>
                    <td style={{ padding: '1rem' }}>{city.views.toLocaleString()}</td>
                    <td style={{ padding: '1rem' }}>{city.inquiries.toLocaleString()}</td>
                    <td style={{ padding: '1rem', color: '#22c55e', fontWeight: '600' }}>{city.conversions}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ background: '#f0fdf4', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500' }}>
                        {Math.round((city.properties / 4887) * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer Links */}
        <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
          <Link href="/" style={{ color: '#2563eb', textDecoration: 'none', marginRight: '2rem' }}>← Back to Home</Link>
          <Link href="/admin-dashboard" style={{ color: '#2563eb', textDecoration: 'none' }}>Admin Dashboard →</Link>
        </div>
      </main>
    </>
  );
};

export default AnalyticsDashboardPage;
