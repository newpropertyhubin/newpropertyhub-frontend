import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import PropertyCard from '../../components/PropertyCard.jsx';

const BuilderPublicProfile = () => {
    const router = useRouter();
    const { id, view } = router.query;
    const [builder, setBuilder] = useState(null);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    // Check if Isolated View is active (URL me ?view=isolated hai ya nahi)
    const isIsolated = view === 'isolated';

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    // 1. Fetch Properties listed by this Broker
                    // Note: This API should return properties populated with brokerId details
                    const { data: propsData } = await axios.get(`/api/properties/by-broker/${id}`);
                    setProperties(propsData || []);

                    // Extract builder info from the first property if available
                    if (propsData && propsData.length > 0 && propsData[0].brokerId) {
                        setBuilder(propsData[0].brokerId);
                    } else {
                        // Fallback: If no properties, try to fetch user profile directly (if endpoint exists)
                        // For now, we handle "No properties found" state
                    }
                } catch (error) {
                    console.error("Error fetching builder profile:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [id]);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Profile...</div>;
    
    // Fallback name
    const builderName = builder?.companyName || builder?.name || "Property Agent";
    const builderEmail = builder?.email;
    const builderPhone = builder?.phone;

    return (
        <div style={{ fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
            <Head>
                <title>{builderName} - Listings | NewPropertyHub</title>
            </Head>

            {/* Header: Isolated View Logic */}
            <header style={{ padding: '15px 20px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem', color: '#0f172a' }}>
                    🏠 NewPropertyHub
                </Link>
                
                {/* Hide Navigation Links if Isolated */}
                {!isIsolated && (
                    <nav>
                        <Link href="/property" style={{ marginLeft: '15px', textDecoration: 'none', color: '#64748b' }}>All Properties</Link>
                    </nav>
                )}
            </header>

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                
                {/* Profile Card */}
                <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '2rem', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', background: '#e0e7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem' }}>
                        🏢
                    </div>
                    <h1 style={{ margin: '0 0 0.5rem', color: '#1f2937' }}>{builderName}</h1>
                    <p style={{ color: '#6b7280', margin: '0 0 1.5rem' }}>
                        {builderEmail && <span>📧 {builderEmail}</span>}
                    </p>
                    
                    {/* Contact Buttons */}
                    {builderPhone && (
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <a href={`tel:${builderPhone}`} style={{ textDecoration: 'none', background: '#10b981', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold' }}>
                                📞 Call
                            </a>
                            <a href={`https://wa.me/${builderPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: '#25D366', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold' }}>
                                💬 WhatsApp
                            </a>
                        </div>
                    )}

                    {/* Share Button for Builder */}
                    {!isIsolated && (
                        <button 
                            onClick={() => {
                                const url = `${window.location.origin}/builder/${id}?view=isolated`;
                                navigator.clipboard.writeText(url);
                                alert("Personalized Link Copied! Share this with your clients.");
                            }}
                            style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            📋 Copy My Shareable Link
                        </button>
                    )}
                </div>

                {/* Listings Grid */}
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#374151' }}>
                    Listings by {builderName} ({properties.length})
                </h2>
                
                {properties.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        {properties.map(prop => (
                            <div key={prop._id}>
                                <PropertyCard property={prop} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: '#6b7280' }}>No active listings found.</p>
                )}
            </main>
        </div>
    );
};

export default BuilderPublicProfile;