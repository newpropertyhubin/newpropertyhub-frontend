import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import debounce from 'lodash.debounce';
import { FaWhatsapp, FaRegBookmark, FaBookmark, FaVideo } from 'react-icons/fa';

const BusinessNetworkPage = () => {
  const { data: session } = useSession();
  const [businesses, setBusinesses] = useState([]);
  const [savedBusinesses, setSavedBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [filters, setFilters] = useState({
    keyword: '',
    purpose: '',
    businessType: '',
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    purpose: 'sell',
    businessType: '',
    description: '',
    turnover: '',
    reasonForSelling: '',
    whatsIncluded: '',
    address: { city: '', state: '' },
    images: [],
    videos: [''], // Start with one empty video input
  });
  const [formResponse, setFormResponse] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchBusinessesCallback = useCallback(async (currentFilters, currentPage) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      params.append('pageNumber', currentPage); // Use currentPage here

      const { data } = await axios.get(`${API_URL}/api/business?${params.toString()}`);
      setBusinesses(data.businesses);
      setCurrentPage(data.page);
      setPages(data.pages);
    } catch (error) {
      console.error("Failed to fetch businesses:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setBusinesses, setCurrentPage, setPages, API_URL]); // Dependencies of the inner function

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchBusinesses = useCallback(debounce(fetchBusinessesCallback, 500), [fetchBusinessesCallback]);

  const fetchProfile = useCallback(async () => {
    // Check if session AND token exist before making request
    if (session?.user?.token) {
        try {
            const { data } = await axios.get(`${API_URL}/api/users/profile`, { headers: { Authorization: `Bearer ${session.user.token}` } });
            setSavedBusinesses(data.savedBusinesses || []);
        } catch (error) {
            // Ignore 401 errors (user might need to relogin), log others
            if (error.response?.status !== 401) {
                console.error("Could not fetch user profile for saved businesses", error);
            }
        }
    }
  }, [session, API_URL, setSavedBusinesses]); // Add all dependencies

  useEffect(() => {
    debouncedFetchBusinesses(filters, currentPage);
    fetchProfile();
  }, [filters, currentPage, debouncedFetchBusinesses, fetchProfile, session]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
        const field = name.split('.')[1];
        setFormData(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleVideoChange = (index, value) => {
    const newVideos = [...formData.videos];
    newVideos[index] = value;
    setFormData(prev => ({ ...prev, videos: newVideos }));
  };

  const addVideoInput = () => {
    setFormData(prev => ({ ...prev, videos: [...prev.videos, ''] }));
  };

  const handleAddBusinessSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      setFormResponse('Error: You must be logged in to post a business.');
      return;
    }
    setFormResponse('Submitting...');

    try {
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.user.token}` } };
      const { data } = await axios.post(`${API_URL}/api/business`, formData, config);
      
      if (data.success) {
        setFormResponse('✅ Business submitted successfully!');
        setTimeout(() => {
          setShowAddModal(false);
          setFormResponse('');
          debouncedFetchBusinesses(filters, 1); // Refresh list
        }, 2000);
      } else {
        setFormResponse(`❌ Error: ${data.message}`);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Submission failed. Please check your data.';
      setFormResponse(`❌ Error: ${message}`);
    }
  };

  const handleSaveBusiness = async (businessId) => {
    if (!session) {
      alert('Please log in to save to your watchlist.');
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${session.user.token}` } };
      const { data } = await axios.post(`${API_URL}/api/users/save-business`, { businessId }, config);
      setSavedBusinesses(data.savedBusinesses);
      alert(data.message);
    } catch (error) {
      alert('Failed to update watchlist.');
      console.error("Watchlist update error:", error);
    }
  };

  const isSaved = (businessId) => {
    return savedBusinesses.includes(businessId);
  };

  const handleVideoClick = (videoUrl) => {
    window.open(videoUrl, '_blank');
  };

  const renderPagination = () => {
    return Array.from({ length: pages }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => setCurrentPage(p)} disabled={p === currentPage} style={{ padding: '0.5rem 1rem', margin: '0 0.25rem', cursor: 'pointer', background: p === currentPage ? '#4338ca' : 'white', color: p === currentPage ? 'white' : 'black' }}>{p}</button>
    ));
  };

  return (
    <>
      <Head>
        <title>Business Network - Buy, Sell, or Partner | NewPropertyHub</title>
        <meta name="description" content="Explore opportunities to buy or sell businesses, find partners, or seek investment on NewPropertyHub's Business Network." />
      </Head>

      <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        <section style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1>🤝 Business Network</h1>
          <p style={{ color: '#666' }}>Find partners, investors, or sell your business.</p>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
          <input id="keyword" name="keyword" placeholder="Search by name, type, city..." value={filters.keyword} onChange={handleFilterChange} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
          <select id="purpose" name="purpose" value={filters.purpose} onChange={handleFilterChange} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}>
            <option value="">All Purposes</option>
            <option value="sell">For Sale</option>
            <option value="partner">Seeking Partner</option>
            <option value="investor">Seeking Investor</option>
          </select>
          <input id="businessType" name="businessType" placeholder="Filter by Business Type (e.g., Restaurant)" value={filters.businessType} onChange={handleFilterChange} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
          <button onClick={() => setShowAddModal(true)} style={{ padding: '0.75rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>+ Add Your Business</button>
        </div>

        {loading ? <p>Loading businesses...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {businesses.map((biz) => (
              <div key={biz._id} style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {biz.isFeatured && <span style={{ position: 'absolute', top: '1rem', left: '1rem', background: '#f59e0b', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', zIndex: 2 }}>⭐ Featured</span>}
                
                {biz.images && biz.images[0] && <img src={biz.images[0]} alt={biz.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
                
                <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', textTransform: 'capitalize' }}>{biz.purpose}</span>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {biz.videos && biz.videos[0] && <FaVideo onClick={() => handleVideoClick(biz.videos[0])} style={{ cursor: 'pointer', color: '#4b5563' }} title="View Video"/>}
                      <button onClick={() => handleSaveBusiness(biz._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: isSaved(biz._id) ? '#4338ca' : '#6b7280' }} title="Save to Watchlist">
                        {isSaved(biz._id) ? <FaBookmark /> : <FaRegBookmark />}
                      </button>
                    </div>
                  </div>

                  <Link href={`/business/${biz.slug}`} passHref>
                    <h3 style={{ margin: '0 0 0.5rem', cursor: 'pointer', color: '#1e40af', textDecoration: 'none' }}>
                      {biz.name} {biz.isVerified && <span title="Verified Business" style={{ color: '#2563eb' }}>✅</span>}
                    </h3>
                  </Link>
                  <p style={{ color: '#6b7280', margin: '0.25rem 0', fontWeight: '500' }}>{biz.businessType}</p>
                  <p style={{ color: '#6b7280', margin: '0.25rem 0' }}>📍 {biz.address.city}, {biz.address.state}</p>
                  {biz.turnover && <p style={{ color: '#166534', margin: '0.5rem 0', fontWeight: '600' }}>Turnover: {biz.turnover}</p>}
                  <p style={{ color: '#4b5563', fontSize: '0.9rem', margin: '1rem 0', height: '60px', overflow: 'hidden', flexGrow: 1 }}>{biz.description}</p>
                  <a href={`https://wa.me/91${biz.phone}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#25d366', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', marginTop: 'auto' }}><FaWhatsapp /> Contact on WhatsApp</a>
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            {pages > 1 && renderPagination()}
        </div>

        {showAddModal && (
          <div className="modal" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', zIndex: 100, overflowY: 'auto' }}>
            <div className="modal-content" style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
              <span className="close-button" onClick={() => setShowAddModal(false)} style={{ float: 'right', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</span>
              <h2>Add Your Business</h2>
              <form onSubmit={handleAddBusinessSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <select name="purpose" value={formData.purpose} onChange={handleFormChange} required>
                  <option value="sell">I want to sell my business</option>
                  <option value="partner">I am looking for a partner</option>
                  <option value="investor">I am looking for an investor</option>
                </select>
                <input type="text" name="name" placeholder="Business Name *" value={formData.name} onChange={handleFormChange} required />
                <input type="text" name="businessType" placeholder="Business Type (e.g., Restaurant, Salon) *" value={formData.businessType} onChange={handleFormChange} required />
                <input type="tel" name="phone" placeholder="Contact Phone Number *" value={formData.phone} onChange={handleFormChange} required />
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input type="text" name="address.city" placeholder="City *" value={formData.address.city} onChange={handleFormChange} required style={{ flex: 1 }} />
                    <input type="text" name="address.state" placeholder="State *" value={formData.address.state} onChange={handleFormChange} required style={{ flex: 1 }} />
                </div>
                <input type="text" name="turnover" placeholder="Annual Turnover (e.g., 50 Lakhs)" value={formData.turnover} onChange={handleFormChange} />
                <textarea name="description" placeholder="Describe your business *" value={formData.description} onChange={handleFormChange} required rows="4"></textarea>
                <textarea name="whatsIncluded" placeholder="What's included in the deal? (e.g., All furniture, stock, brand name)" value={formData.whatsIncluded} onChange={handleFormChange} rows="3"></textarea>
                {formData.purpose === 'sell' && <textarea name="reasonForSelling" placeholder="Reason for selling?" value={formData.reasonForSelling} onChange={handleFormChange} rows="2"></textarea>}
                
                <label>Video Links (YouTube, Instagram, Facebook)</label>
                {formData.videos.map((video, index) => (
                    <input key={index} type="url" placeholder="https://..." value={video} onChange={(e) => handleVideoChange(index, e.target.value)} />
                ))}
                <button type="button" onClick={addVideoInput}>+ Add another video</button>

                <button type="submit">Submit Business</button>
                {formResponse && <p style={{ marginTop: '1rem', textAlign: 'center' }}>{formResponse}</p>}
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default BusinessNetworkPage;