import Head from 'next/head';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

// This would be a great place to use a reusable AdminLayout component

const AmenitiesAdminPage = () => {
  const [amenities, setAmenities] = useState([]);
  const [newAmenity, setNewAmenity] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  // Fetch and display amenities from backend
  const loadAmenities = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      // const res = await fetch('/api/amenities');
      // const data = await res.json();
      
      // Using mock data for demonstration
      const mockData = [
        { id: 1, name: 'WiFi' },
        { id: 2, name: 'Parking' },
        { id: 3, name: 'Swimming Pool' },
      ];
      setAmenities(mockData);

    } catch (err) {
      console.error(err);
      alert('Failed to load amenities.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadAmenities();
  }, []);

  // Add new amenity
  const handleAddAmenity = async () => {
    if (!newAmenity.trim()) return alert('Enter amenity name');

    console.log('Adding amenity:', newAmenity);
    // const res = await fetch('/api/amenities', {
    //   method: 'POST',
    //   headers: {'Content-Type':'application/json'},
    //   body: JSON.stringify({ name: newAmenity })
    // });
    // const result = await res.json();
    // alert(result.message);
    
    // For demonstration:
    setAmenities([...amenities, { id: Date.now(), name: newAmenity }]);
    setNewAmenity('');
    alert('Amenity added successfully!');
  };

  // Delete amenity
  const handleDeleteAmenity = async (id) => {
    if (!confirm('Are you sure?')) return;

    console.log('Deleting amenity with id:', id);
    // const res = await fetch(`/api/amenities/${id}`, { method: 'DELETE' });
    // const result = await res.json();
    // alert(result.message);

    // For demonstration:
    setAmenities(amenities.filter(amenity => amenity.id !== id));
    alert('Amenity deleted successfully!');
  };

  return (
    <>
      <Head>
        <title>Manage Amenities - Admin Dashboard</title>
      </Head>

      <header>
        <h1>NewPropertyHub - Admin</h1>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/admin-dashboard">Dashboard</Link>
        </nav>
      </header>

      <main>
        <h2>Manage Amenities</h2>
        <label>
          <input type="checkbox" checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} />
          Enable Amenities Section
        </label>

        {isEnabled && (
          <div id="amenitiesControls">
            <input type="text" value={newAmenity} onChange={(e) => setNewAmenity(e.target.value)} placeholder="Add new amenity" />
            <button onClick={handleAddAmenity}>Add Amenity</button>

            <table>
              <thead><tr><th>ID</th><th>Amenity</th><th>Action</th></tr></thead>
              <tbody>
                {loading ? (<tr><td colSpan="3">Loading...</td></tr>) : (
                  amenities.map((item) => (
                    <tr key={item.id}><td>{item.id}</td><td>{item.name}</td><td><button onClick={() => handleDeleteAmenity(item.id)}>Delete</button></td></tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer><p>&copy; 2025 NewPropertyHub. All Rights Reserved.</p></footer>
    </>
  );
};

export default AmenitiesAdminPage;