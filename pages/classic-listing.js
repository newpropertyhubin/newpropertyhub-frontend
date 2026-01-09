import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const ClassicListingPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    setLoading(true);
    // Mock API call
    const mockData = [
      { _id: '1', title: 'Modern 2BHK in City Center', price: '75,00,000', city: 'Mumbai', images: ['https://via.placeholder.com/300x200'], amenities: ['WiFi', 'Parking'] },
      { _id: '2', title: 'Spacious Villa with Garden', price: '2,50,00,000', city: 'Pune', images: ['https://via.placeholder.com/300x200'], amenities: ['Garden', 'Pool'] },
    ];
    // const res = await fetch('/api/properties');
    // const data = await res.json();
    setProperties(mockData);
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const applyFilters = () => {
    // In a real app, this would refetch data with filter query params
    alert("Filter logic would be implemented here.");
  };

  return (
    <>
      <Head>
        <title>Classic Listing - NewPropertyHub</title>
      </Head>

      <nav className="top-navbar">
        <div className="logo"><Link href="/">NewPropertyHub</Link></div>
        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/property">Properties</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </nav>

      <section className="property-listing">
        <h1>Property Listings</h1>

        <div className="filters">
          <input id="searchInput" placeholder="Search city / property type" />
          <select id="sortSelect">
            <option value="newest">Newest</option>
            <option value="priceLow">Price: Low → High</option>
            <option value="priceHigh">Price: High → Low</option>
          </select>
          <div className="amenities-filters">
            <label><input type="checkbox" value="WiFi" className="amenityFilter" /> WiFi</label>
            <label><input type="checkbox" value="Parking" className="amenityFilter" /> Parking</label>
          </div>
          <button onClick={applyFilters}>Apply</button>
        </div>

        <ul id="propertyGrid" className="grid">
          {loading ? <p>Loading properties...</p> : (
            properties.map((property) => (
              <li className="card" key={property._id}>
                <img src={property.images && property.images.length > 0 ? property.images[0] : 'img/placeholder.jpg'} alt={property.title} />
                <div className="card-body">
                  <h3>{property.title}</h3>
                  <p>₹{property.price} • {property.city}</p>
                  <div className="amenities">{(property.amenities || []).join(' · ')}</div>
                  <div className="card-actions">
                    <Link href={`/property-details?id=${property._id}`}>View Details</Link>
                    {property.contact && <a href={`https://wa.me/${property.contact}`} target="_blank" rel="noopener noreferrer">Contact</a>}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>

      <footer>
        <p>&copy; 2025 NewPropertyHub. All Rights Reserved.</p>
      </footer>
    </>
  );
};

export default ClassicListingPage;