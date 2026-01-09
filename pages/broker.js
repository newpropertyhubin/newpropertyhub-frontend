import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const BrokerDashboardPage = () => {
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [instagramData, setInstagramData] = useState(null);
  const [, setLoadingInstagram] = useState(false);
  const [instagramConnected, setInstagramConnected] = useState(false);
  
  // Real-time stats
  const [stats, setStats] = useState({
    todayViews: 0,
    weekViews: 0,
    monthViews: 0,
    todayInquiries: 0,
    weekInquiries: 0,
    totalListings: 32,
    activeListings: 32,
    soldThisMonth: 3,
    responseTime: '2.5 hrs',
    conversionRate: '15%',
    lastUpdated: 'Loading...',
  });

  const [socialStats, setSocialStats] = useState({
    instagramFollowers: 0,
    instagramPosts: 0,
    facebookFollowers: 8230,
    linkedinConnections: 3400,
    totalReach: 11630,
  });

  const [leads] = useState([
    { id: 1, name: 'Rajesh Kumar', inquiry: '3BHK Villa', status: 'Interested', date: '2 hrs ago' },
    { id: 2, name: 'Priya Sharma', inquiry: '2BHK Apartment', status: 'Negotiating', date: '5 hrs ago' },
    { id: 3, name: 'Amit Patel', inquiry: 'Commercial Space', status: 'New', date: '1 day ago' },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    // Fetch Instagram data on component mount
    fetchInstagramData();
    
    // Set initial time on client side to avoid hydration mismatch
    setStats(prev => ({
      ...prev,
      lastUpdated: new Date().toLocaleTimeString(),
    }));

    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        todayViews: Math.floor(Math.random() * 300) + 50,
        todayInquiries: Math.floor(Math.random() * 30) + 5,
        lastUpdated: new Date().toLocaleTimeString(),
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Fetch Instagram data from API
  const fetchInstagramData = async () => {
    setLoadingInstagram(true);
    try {
      const response = await fetch('/api/instagram/broker/demo-broker');
      const result = await response.json();
      
      if (result.success && result.data) {
        setInstagramData(result.data);
        setSocialStats(prev => ({
          ...prev,
          instagramFollowers: result.data.followers,
          instagramPosts: result.data.posts,
          totalReach: result.data.followers + prev.facebookFollowers + prev.linkedinConnections
        }));
        setInstagramConnected(true);
      }
    } catch (error) {
      console.error('Error fetching Instagram data:', error);
      // Fallback to mock data
      setInstagramData({
        username: 'mumbaibroker_realestate',
        followers: 15420,
        posts: 342,
        engagement: 4.2,
        recentPosts: [
          { id: 1, image: 'https://via.placeholder.com/300?text=Luxury+Villa', caption: '🏡 3BHK Luxury Villa', likes: 245, date: '2 days ago' },
          { id: 2, image: 'https://via.placeholder.com/300?text=Commercial', caption: '💼 Commercial Space', likes: 189, date: '4 days ago' },
          { id: 3, image: 'https://via.placeholder.com/300?text=Penthouse', caption: '✨ Penthouse View', likes: 312, date: '6 days ago' }
        ]
      });
      setSocialStats(prev => ({
        ...prev,
        instagramFollowers: 15420,
        instagramPosts: 342,
        totalReach: 15420 + prev.facebookFollowers + prev.linkedinConnections
      }));
      setInstagramConnected(true);
    } finally {
      setLoadingInstagram(false);
    }
  };

  const handleBlogSubmit = (e) => {
    e.preventDefault();
    alert('Blog post submitted for approval!');
    setBlogTitle('');
    setBlogContent('');
  };

  return (
    <>
      <Head>
        <title>Broker Dashboard - PropertyHub</title>
      </Head>

      <main style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '2rem' }}>
        {/* Header with Real-time Status */}
        <section style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #0056b3 100%)', color: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ margin: '0 0 0.5rem', fontSize: '2rem' }}>Welcome Back, Broker! 👋</h1>
              <p style={{ opacity: 0.95, margin: 0 }}>Last updated: {stats.lastUpdated} • All systems live</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '1rem 1.5rem', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>Response Rate</p>
              <p style={{ margin: '0.5rem 0 0', fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.conversionRate}</p>
            </div>
          </div>
        </section>

        {/* TODAY'S ACTIVITY - Real-time */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: 'var(--dark)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>📊 Today's Activity (Live)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', opacity: 0.9 }}>Views Today</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{stats.todayViews}</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.8, margin: 0 }}>🔴 Live tracking</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', opacity: 0.9 }}>Inquiries Today</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{stats.todayInquiries}</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.8, margin: 0 }}>🔴 Live tracking</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', opacity: 0.9 }}>Response Time</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{stats.responseTime}</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.8, margin: 0 }}>Average</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', opacity: 0.9 }}>Conversion</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{stats.conversionRate}</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.8, margin: 0 }}>This week</p>
            </div>
          </div>
        </section>

        {/* THIS WEEK STATS */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: 'var(--dark)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>📈 Weekly Overview</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: 'var(--card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
              <h3 style={{ color: 'var(--muted)', margin: '0 0 1rem', fontSize: '0.9rem' }}>Views This Week</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent)', margin: 0 }}>{stats.weekViews || 450}</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '0.5rem 0 0' }}>↑ 12% from last week</p>
            </div>
            <div style={{ background: 'var(--card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
              <h3 style={{ color: 'var(--muted)', margin: '0 0 1rem', fontSize: '0.9rem' }}>Inquiries This Week</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent)', margin: 0 }}>{stats.weekInquiries || 23}</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '0.5rem 0 0' }}>↑ 8% from last week</p>
            </div>
            <div style={{ background: 'var(--card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
              <h3 style={{ color: 'var(--muted)', margin: '0 0 1rem', fontSize: '0.9rem' }}>Active Listings</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent)', margin: 0 }}>{stats.activeListings}</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '0.5rem 0 0' }}>All properties live</p>
            </div>
            <div style={{ background: 'var(--card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
              <h3 style={{ color: 'var(--muted)', margin: '0 0 1rem', fontSize: '0.9rem' }}>Sold This Month</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#28a745', margin: 0 }}>{stats.soldThisMonth}</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '0.5rem 0 0' }}>Congratulations! 🎉</p>
            </div>
          </div>
        </section>

        {/* RECENT LEADS - CRM */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: 'var(--dark)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>👥 Recent Leads (Top Priorities)</h2>
          <div style={{ background: 'var(--card)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--dark)' }}>Name</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--dark)' }}>Property Interest</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--dark)' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--dark)' }}>Time</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--dark)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} style={{ borderBottom: '1px solid var(--border)', backgroundColor: lead.status === 'New' ? 'rgba(0, 123, 255, 0.05)' : 'transparent' }}>
                      <td style={{ padding: '1rem', color: 'var(--dark)', fontWeight: '500' }}>{lead.name}</td>
                      <td style={{ padding: '1rem', color: 'var(--muted)' }}>{lead.inquiry}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          background: lead.status === 'New' ? '#fff3cd' : lead.status === 'Interested' ? '#d1ecf1' : '#d4edda',
                          color: lead.status === 'New' ? '#856404' : lead.status === 'Interested' ? '#0c5460' : '#155724'
                        }}>
                          {lead.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--muted)', fontSize: '0.9rem' }}>{lead.date}</td>
                      <td style={{ padding: '1rem' }}>
                        <a href={`https://wa.me/7828289433?text=Hi, I'm interested in ${lead.inquiry}`} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>
                          WhatsApp
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Link href="/index-crm" style={{ display: 'inline-block', marginTop: '1rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' }}>
            View All Leads in CRM → 
          </Link>
        </section>

        {/* SOCIAL MEDIA STATS */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: 'var(--dark)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>📱 Social Media Reach</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'var(--card)', padding: '1.5rem', borderRadius: '12px', border: '2px solid #E4405F', boxShadow: 'var(--shadow)' }}>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>📷 Instagram</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#E4405F', margin: '0.5rem 0' }}>{socialStats.instagramFollowers.toLocaleString()}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>Followers • {socialStats.instagramPosts} posts</p>
            </div>
            <div style={{ background: 'var(--card)', padding: '1.5rem', borderRadius: '12px', border: '2px solid #3b5998', boxShadow: 'var(--shadow)' }}>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>📘 Facebook</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#3b5998', margin: '0.5rem 0' }}>{socialStats.facebookFollowers.toLocaleString()}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>Followers • Growing</p>
            </div>
            <div style={{ background: 'var(--card)', padding: '1.5rem', borderRadius: '12px', border: '2px solid #0A66C2', boxShadow: 'var(--shadow)' }}>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>💼 LinkedIn</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0A66C2', margin: '0.5rem 0' }}>{socialStats.linkedinConnections.toLocaleString()}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>Connections • Professional</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #0056b3 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', opacity: 0.9 }}>🌐 Total Reach</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{socialStats.totalReach.toLocaleString()}</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: 0 }}>Combined followers</p>
            </div>
          </div>
          <div style={{ marginTop: '1.5rem', background: 'var(--bg)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
            <p style={{ color: 'var(--muted)', margin: '0 0 1rem' }}>📲 Connect your social accounts to auto-sync followers and posts</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{ background: '#E4405F', color: 'white', padding: '0.6rem 1.2rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>
                Connect Instagram
              </button>
              <button style={{ background: '#3b5998', color: 'white', padding: '0.6rem 1.2rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>
                Connect Facebook
              </button>
              <button style={{ background: '#0A66C2', color: 'white', padding: '0.6rem 1.2rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>
                Connect LinkedIn
              </button>
            </div>
          </div>
        </section>

        {/* INSTAGRAM RECENT POSTS */}
        {instagramConnected && instagramData && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: 'var(--dark)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
              📸 Instagram Recent Posts (@{instagramData.username})
            </h2>
            <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Latest posts from your Instagram profile showing property listings and engagement metrics
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {instagramData.recentPosts && instagramData.recentPosts.map((post) => (
                <div key={post.id} style={{ background: 'var(--card)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow)', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  {/* Post Image */}
                  <div style={{ width: '100%', height: '280px', background: 'var(--bg)', overflow: 'hidden', position: 'relative' }}>
                    <img 
                      src={post.image} 
                      alt={post.caption} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: '#E4405F', color: 'white', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>
                      ❤️ {post.likes}
                    </div>
                  </div>

                  {/* Post Caption */}
                  <div style={{ padding: '1.5rem' }}>
                    <p style={{ color: 'var(--dark)', margin: '0 0 1rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      {post.caption}
                    </p>
                    
                    {/* Engagement Stats */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: 'var(--muted)', fontSize: '0.75rem', margin: '0 0 0.3rem' }}>Likes</p>
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#E4405F', margin: 0 }}>{post.likes}</p>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: 'var(--muted)', fontSize: '0.75rem', margin: '0 0 0.3rem' }}>Comments</p>
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent)', margin: 0 }}>{post.comments || Math.floor(Math.random() * 50)}</p>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: 'var(--muted)', fontSize: '0.75rem', margin: '0 0 0.3rem' }}>Posted</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>{post.date}</p>
                      </div>
                    </div>

                    {/* View Post Button */}
                    <a 
                      href={instagramData.profileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        display: 'inline-block',
                        width: '100%',
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        padding: '0.6rem',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}
                    >
                      View on Instagram
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Instagram Profile Summary */}
            <div style={{ marginTop: '2rem', background: 'linear-gradient(135deg, #E4405F 0%, #F77737 100%)', color: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '1.2rem' }}>📊 Instagram Profile Summary</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <p style={{ margin: 0, opacity: 0.9, fontSize: '0.85rem' }}>Total Followers</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.3rem 0 0' }}>{instagramData.followers.toLocaleString()}</p>
                </div>
                <div>
                  <p style={{ margin: 0, opacity: 0.9, fontSize: '0.85rem' }}>Total Posts</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.3rem 0 0' }}>{instagramData.posts}</p>
                </div>
                <div>
                  <p style={{ margin: 0, opacity: 0.9, fontSize: '0.85rem' }}>Avg Engagement</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.3rem 0 0' }}>{instagramData.engagement}%</p>
                </div>
                <div>
                  <p style={{ margin: 0, opacity: 0.9, fontSize: '0.85rem' }}>Status</p>
                  <p style={{ fontSize: '1.2rem', margin: '0.3rem 0 0' }}>{instagramData.trending ? '🔥 Trending' : '✅ Active'}</p>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.95 }}>
                Last synced: {new Date(instagramData.lastUpdated).toLocaleString()}
              </p>
            </div>
          </section>
        )}

        {/* QUICK ACTIONS */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: 'var(--dark)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>⚡ Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <button style={{ background: 'var(--accent)', color: 'white', padding: '1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', textAlign: 'center' }}>
              ➕ Add New Property
            </button>
            <button style={{ background: '#28a745', color: 'white', padding: '1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', textAlign: 'center' }}>
              📊 View Analytics
            </button>
            <button style={{ background: '#FFC107', color: '#333', padding: '1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', textAlign: 'center' }}>
              📩 Send Campaign
            </button>
            <button style={{ background: '#17a2b8', color: 'white', padding: '1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', textAlign: 'center' }}>
              💬 Message Leads
            </button>
          </div>
        </section>

        {/* Blog Post Section */}
        <section style={{ background: 'var(--card)', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow)', marginBottom: '3rem' }}>
          <h2 style={{ color: 'var(--dark)', marginBottom: '1.5rem' }}>Publish Blog Post</h2>
          <form onSubmit={handleBlogSubmit} style={{ maxWidth: '600px' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="blogTitle" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--dark)' }}>Post Title *</label>
              <input 
                type="text" 
                id="blogTitle" 
                placeholder="e.g., Top 5 Tips for Buying Your First Home" 
                value={blogTitle} 
                onChange={(e) => setBlogTitle(e.target.value)} 
                required 
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '1rem' }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="blogContent" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--dark)' }}>Content *</label>
              <textarea 
                id="blogContent" 
                placeholder="Write your blog post here..." 
                value={blogContent} 
                onChange={(e) => setBlogContent(e.target.value)} 
                required 
                rows="6"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit' }}
              />
            </div>
            <button 
              type="submit" 
              style={{ 
                background: 'var(--accent)', 
                color: 'white', 
                padding: '0.75rem 2rem', 
                border: 'none', 
                borderRadius: '8px', 
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Submit for Approval
            </button>
          </form>
        </section>

        {/* CRM Link */}
        <section style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #0056b3 100%)', color: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Manage Your Leads</h2>
          <p style={{ opacity: 0.95, marginBottom: '1.5rem' }}>Access our CRM system to track and manage your client enquiries</p>
          <Link href="/index-crm" style={{ background: 'white', color: 'var(--accent)', padding: '0.75rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block' }}>
            Go to CRM & Lead Management
          </Link>
        </section>
      </main>
    </>
  );
};

export default BrokerDashboardPage;