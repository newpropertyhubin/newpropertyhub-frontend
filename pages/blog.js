import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const BlogPage = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ title: '', content: '', image: '', tags: '', videoLink: '' });
  const [submitStatus, setSubmitStatus] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Fetch Blogs
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/posts`);
        setPosts(data.posts || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [API_URL]);

  // Handle Blog Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) return alert("Please login to write a blog.");
    
    setSubmitStatus('Submitting...');

    try {
      const config = { headers: { Authorization: `Bearer ${session.user.token}` } };
      // Prepare data payload
      const payload = {
        ...formData,
        videoLinks: formData.videoLink ? [formData.videoLink] : [] // Convert single link to array
      };
      await axios.post(`${API_URL}/api/posts`, payload, config);
      
      setSubmitStatus('success');
      setFormData({ title: '', content: '', image: '', tags: '', videoLink: '' });
      
      // Auto-hide success message and modal
      setTimeout(() => {
        setSubmitStatus('');
        setShowCreateModal(false);
      }, 3000);

    } catch (error) {
      console.error("Blog submission failed:", error);
      setSubmitStatus('error');
    }
  };

  // Handle Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('folderPath', 'blog_images');

    try {
      setSubmitStatus('Uploading image...');
      const { data } = await axios.post(`${API_URL}/api/upload/firebase`, uploadData);
      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.data.url }));
        setSubmitStatus('');
      }
    } catch (error) {
      console.error("Upload failed", error);
      setSubmitStatus('Image upload failed. Try using a URL.');
    }
  };

  // Google AdSense Component
  const AdSenseSlot = () => (
    <div style={{ background: '#f0f0f0', padding: '20px', textAlign: 'center', margin: '20px 0', borderRadius: '8px', border: '1px dashed #ccc' }}>
      <p style={{ color: '#888', fontSize: '0.8rem' }}>Advertisement</p>
      {/* Replace with actual Google AdSense Script */}
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense ID
           data-ad-slot="1234567890"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <script>
           (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </div>
  );

  return (
    <>
      <Head>
        <title>Real Estate Blog & Insights - NewPropertyHub</title>
        <meta name="description" content="Latest real estate news, tips for buyers and sellers, and market trends." />
      </Head>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem', color: '#1f2937' }}>📰 PropertyHub Blog</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Insights from Admins, Builders, and Experts.</p>
          </div>
          
          {session ? (
            <button 
              onClick={() => setShowCreateModal(true)}
              style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
            >
              ✍️ Write a Blog
            </button>
          ) : (
            <Link href="/login">
              <button style={{ background: '#e5e7eb', color: '#374151', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                Login to Write
              </button>
            </Link>
          )}
        </div>

        {/* Top Ad Slot */}
        <AdSenseSlot />

        {/* Blog Grid */}
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading articles...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {posts.length > 0 ? posts.map(post => (
              <div key={post._id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', transition: 'transform 0.2s' }}>
                <img 
                  src={post.image || 'https://via.placeholder.com/400x250?text=Real+Estate+Blog'} 
                  alt={post.title} 
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                />
                <div style={{ padding: '1.5rem' }}>
                  {/* Show Video Icon if video exists */}
                  {post.videoLinks && post.videoLinks.length > 0 && (
                    <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem', color: '#dc2626' }}>
                      🎥 Includes Video
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {post.tags && post.tags.split(',').map((tag, idx) => (
                      <span key={idx} style={{ fontSize: '0.75rem', background: '#e0e7ff', color: '#4338ca', padding: '2px 8px', borderRadius: '4px' }}>
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                  <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem', color: '#111827' }}>{post.title}</h2>
                  <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1rem' }}>
                    {post.content.substring(0, 100)}...
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#9ca3af' }}>
                    <span>By {post.authorId?.name || 'Admin'}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', background: '#f9fafb', borderRadius: '12px' }}>
                <h3>No blogs found yet.</h3>
                <p>Be the first to write one!</p>
              </div>
            )}
          </div>
        )}

        {/* Bottom Ad Slot */}
        <AdSenseSlot />

        {/* Create Blog Modal */}
        {showCreateModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>📝 Write a New Blog</h2>
                <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
              </div>

              {submitStatus === 'success' ? (
                <div style={{ background: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                  <h3>✅ Blog Submitted!</h3>
                  <p>Your post has been sent to our <strong>AI System</strong> for approval.</p>
                  <ul style={{ textAlign: 'left', fontSize: '0.9rem', marginTop: '1rem' }}>
                    <li>🤖 <strong>Step 1:</strong> AI Review (Instant - 12 hrs)</li>
                    <li>👤 <strong>Step 2:</strong> Admin Review (If AI fails)</li>
                    <li>⏱️ <strong>Step 3:</strong> Auto-Approval (After 24 hrs)</li>
                  </ul>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Title</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="Enter an engaging title..."
                      style={{ width: '100%', padding: '0.8rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Featured Image</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white' }}
                      />
                      <span style={{ color: '#666' }}>OR</span>
                      <input 
                        type="url" 
                        value={formData.image}
                        onChange={e => setFormData({...formData, image: e.target.value})}
                        placeholder="Paste Image URL..."
                        style={{ flex: 1, padding: '0.8rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                      />
                    </div>
                    {formData.image && <img src={formData.image} alt="Preview" style={{ marginTop: '10px', height: '100px', borderRadius: '6px', objectFit: 'cover' }} />}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Video URL (YouTube/Instagram)</label>
                    <input 
                      type="url" 
                      value={formData.videoLink}
                      onChange={e => setFormData({...formData, videoLink: e.target.value})}
                      placeholder="https://youtube.com/watch?v=..."
                      style={{ width: '100%', padding: '0.8rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Tags (comma separated)</label>
                    <input 
                      type="text" 
                      value={formData.tags}
                      onChange={e => setFormData({...formData, tags: e.target.value})}
                      placeholder="Real Estate, Investment, Tips"
                      style={{ width: '100%', padding: '0.8rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Content</label>
                    <textarea 
                      required 
                      rows="6"
                      value={formData.content}
                      onChange={e => setFormData({...formData, content: e.target.value})}
                      placeholder="Write your article here..."
                      style={{ width: '100%', padding: '0.8rem', border: '1px solid #d1d5db', borderRadius: '6px', fontFamily: 'inherit' }}
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitStatus === 'Submitting...'}
                    style={{ background: '#2563eb', color: 'white', padding: '1rem', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}
                  >
                    {submitStatus === 'Submitting...' ? 'Submitting...' : 'Submit for Approval'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default BlogPage;