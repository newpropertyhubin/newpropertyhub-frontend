import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const CampaignManager = ({ myProperties }) => {
    const { data: session } = useSession();
    const [campaigns, setCampaigns] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // Form state
    const [selectedProperty, setSelectedProperty] = useState('');
    const [duration, setDuration] = useState(7); // Default 7 days
    const [calculatedCost, setCalculatedCost] = useState(0);
    const AD_RATE_PER_DAY = 100; // In a real app, this would be fetched from settings

    useEffect(() => {
        const fetchCampaigns = async () => {
            setLoading(true);
            try {
                const config = { headers: { Authorization: `Bearer ${session.user.token}` } };
                const { data } = await axios.get('/api/campaigns/my-campaigns', config);
                setCampaigns(data);
            } catch {
                setError('Could not load your campaigns.');
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchCampaigns();
        }
    }, [session]);

    useEffect(() => {
        // Recalculate cost when duration changes
        setCalculatedCost(duration * AD_RATE_PER_DAY);
    }, [duration]);

    const handleCreateCampaign = async (e) => {
        e.preventDefault();
        setError('');
        if (!selectedProperty) {
            setError('Please select a property to feature.');
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${session.user.token}` } };
            const { data } = await axios.post('/api/campaigns', {
                propertyId: selectedProperty,
                durationInDays: duration,
                adType: 'featured_listing',
            }, config);

            // Here you would redirect to a payment page with the order details
            alert(`Campaign created! Proceed to pay ₹${data.campaign.budget}.`);
            setShowCreateForm(false);
            // Refresh list
            const { data: updatedCampaigns } = await axios.get('/api/campaigns/my-campaigns', config);
            setCampaigns(updatedCampaigns);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create campaign.');
        }
    };

    return (
        <section style={{ margin: '2rem 0', padding: '2rem', background: '#f9fafb', borderRadius: '12px' }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '600', margin: 0 }}>📢 My Ad Campaigns</h2>
                <button onClick={() => setShowCreateForm(!showCreateForm)} style={{ padding: '0.8rem 1.5rem', fontWeight: 'bold', cursor: 'pointer', borderRadius: '8px', border: 'none', color: 'white', background: showCreateForm ? '#6c757d' : '#0d6efd' }}>
                    {showCreateForm ? 'Cancel' : 'Create New Campaign'}
                </button>
            </div>

            {error && <p style={{color: 'red'}}>{error}</p>}

            {showCreateForm && (
                <form onSubmit={handleCreateCampaign} style={{padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', background: 'white', marginBottom: '2rem'}}>
                    <h3 style={{marginTop: 0}}>Create New "Featured Property" Campaign</h3>
                    <div style={{marginBottom: '1rem'}}>
                        <label>Select Property to Feature</label>
                        <select value={selectedProperty} onChange={e => setSelectedProperty(e.target.value)} required style={{width: '100%', padding: '0.8rem'}}>
                            <option value="">-- Select a Property --</option>
                            {myProperties.map(prop => <option key={prop._id} value={prop._id}>{prop.title}</option>)}
                        </select>
                    </div>
                    <div style={{marginBottom: '1rem'}}>
                        <label>Campaign Duration (in days)</label>
                        <input type="number" value={duration} onChange={e => setDuration(e.target.value)} min="1" required style={{width: '100%', padding: '0.8rem'}} />
                    </div>
                    <div style={{padding: '1rem', background: '#eef2ff', borderRadius: '8px', textAlign: 'center'}}>
                        <p style={{margin: 0, fontSize: '1.1rem'}}>Calculated Cost: <span style={{fontWeight: 'bold'}}>₹{calculatedCost}</span> (@ ₹{AD_RATE_PER_DAY}/day)</p>
                    </div>
                    <button type="submit" style={{width: '100%', marginTop: '1rem', padding: '1rem', background: '#198754', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem'}}>Proceed to Payment</button>
                </form>
            )}

            {loading && <p>Loading campaigns...</p>}
            {!loading && campaigns.length === 0 && <p>You have no active or past campaigns.</p>}
            
            <div style={{display: 'grid', gap: '1rem'}}>
                {campaigns.map(campaign => (
                    <div key={campaign._id} style={{display: 'flex', gap: '1rem', background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd'}}>
                        <img src={campaign.propertyId.images[0] || 'https://via.placeholder.com/150'} alt={campaign.propertyId.title} style={{width: '150px', height: '100px', objectFit: 'cover', borderRadius: '4px'}} />
                        <div>
                            <h4 style={{marginTop: 0}}>{campaign.propertyId.title}</h4>
                            <p>Status: <span style={{fontWeight: 'bold', color: campaign.status === 'active' ? 'green' : 'orange'}}>{campaign.status}</span></p>
                            <p>Runs from {new Date(campaign.startDate).toLocaleDateString()} to {new Date(campaign.endDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CampaignManager;
