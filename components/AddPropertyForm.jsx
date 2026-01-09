import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { uploadPropertyImages } from '../utils/uploadservice';

const AddPropertyForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  
  // State for Builder Project Configurations
  const [configurations, setConfigurations] = useState([]);
  const [currentConfig, setCurrentConfig] = useState({
    type: 'Flat', variant: '', size: '', basePrice: '', totalUnits: ''
  });

  // State for Project Infrastructure
  const [infrastructure, setInfrastructure] = useState([]);
  const [currentInfra, setCurrentInfra] = useState('');


  const [formData, setFormData] = useState({
    userType: 'Owner',
    reraId: '',
    title: '',
    description: '',
    price: '',
    location: '',
    city: '',
    type: 'Apartment',
    bhk: '',
    area: '',
    amenities: '',
    images: [],
    videoUrl: '',
    virtualTourLink: '', // Added for virtual tour
    instagramUrl: '',
    facebookUrl: '',
    latitude: '',
    longitude: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Configuration Inputs (For Builders)
  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setCurrentConfig(prev => ({ ...prev, [name]: value }));
  };

  // Handle Infrastructure Inputs
  const handleAddInfra = () => {
    if (!currentInfra.trim()) return;
    setInfrastructure([...infrastructure, currentInfra]);
    setCurrentInfra(''); // Reset input
  };

  const handleRemoveInfra = (index) => {
    setInfrastructure(infrastructure.filter((_, i) => i !== index));
  };

  // Add Configuration to List
  const handleAddConfig = () => {
    if (!currentConfig.variant || !currentConfig.basePrice) {
      alert("Please fill Variant and Price");
      return;
    }
    setConfigurations([...configurations, currentConfig]);
    setCurrentConfig({ type: 'Flat', variant: '', size: '', basePrice: '', totalUnits: '' }); // Reset
  };

  const handleRemoveConfig = (index) => {
    setConfigurations(configurations.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // Convert FileList to Array
      const fileArray = Array.from(files);
      const urls = await uploadPropertyImages(fileArray);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setGettingLocation(true);
      navigator.geolocation.getCurrentPosition(function(position) {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
        setGettingLocation(false);
      }, function(error) {
        setGettingLocation(false);
        alert("Error getting location: " + error.message);
      });
    } else {
      alert("Geolocation is not available in your browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert("Please login to list a property");
        router.push('/login');
        return;
      }

      if (formData.userType === 'Builder') {
        // --- BUILDER FLOW (Create Project) ---
        if (configurations.length === 0) {
          alert("Please add at least one configuration (e.g., 2 BHK Flat)");
          setLoading(false);
          return;
        }

        const projectData = {
          name: formData.title,
          description: formData.description,
          reraId: formData.reraId,
          address: {
            city: formData.city,
            locality: formData.location,
            mapLocation: {
              type: 'Point',
              coordinates: [Number(formData.longitude), Number(formData.latitude)]
            }
          },
          amenities: formData.amenities.split(',').map(item => item.trim()).filter(i => i),
          infrastructure: infrastructure,
          projectGallery: formData.images,
          projectVideo: formData.videoUrl,
          configurations: configurations.map(c => ({
            ...c,
            basePrice: Number(c.basePrice),
            totalUnits: Number(c.totalUnits)
          }))
        };

        await axios.post(`${API_URL}/api/projects`, projectData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Project listed successfully!");

      } else {
        // --- OWNER/AGENT FLOW (Create Single Property) ---
        const propertyData = {
          ...formData,
          price: Number(formData.price),
          area: Number(formData.area),
          bhk: Number(formData.bhk),
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
          amenities: formData.amenities.split(',').map(item => item.trim()).filter(i => i),
        };

        await axios.post(`${API_URL}/api/properties`, propertyData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Property listed successfully!");
      }
      
      // Redirect based on User Role
      if (formData.userType === 'Builder') {
        router.push('/builder-dashboard');
      } else if (formData.userType === 'PG-Owner') {
        router.push('/pg-dashboard');
      } else if (formData.userType === 'Resort-Owner') {
        router.push('/resort-dashboard');
      } else {
        router.push('/property');
      }
    } catch (error) {
      console.error("Error submitting property:", error);
      alert("Failed to submit property. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-property-form">
      {/* User Type & RERA Section */}
      <div className="form-row">
        <div className="form-group">
          <label>I am a</label>
          <select name="userType" value={formData.userType} onChange={handleChange} style={{padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px'}}>
            <option value="Owner">Owner (Individual Seller)</option>
            <option value="Agent">Agent</option>
            <option value="Builder">Builder</option>
            <option value="PG-Owner">PG / Hostel Owner</option>
            <option value="Resort-Owner">Resort / Holiday Home Owner</option>
          </select>
        </div>
        {(formData.userType === 'Agent' || formData.userType === 'Builder') && (
          <div className="form-group">
            <label>RERA License No. <span style={{color: 'red'}}>*</span></label>
            <input type="text" name="reraId" value={formData.reraId} onChange={handleChange} placeholder="Enter RERA ID" required />
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Property Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Luxury Apartment in Mumbai" />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Describe the property..." rows="4"></textarea>
      </div>

      {/* CONDITIONAL RENDERING BASED ON USER TYPE */}
      {formData.userType === 'Builder' ? (
        // --- BUILDER SECTION (Add Multiple Configurations) ---
        <div className="form-group" style={{background: '#f0f9ff', padding: '15px', borderRadius: '8px', border: '1px solid #bae6fd'}}>
          <label style={{fontWeight: 'bold', color: '#0369a1'}}>🏗️ Project Configurations (Inventory)</label>
          <p style={{fontSize: '0.85rem', color: '#555'}}>Add separate entries for each type (e.g., one entry for "2 BHK" with 50 units, another for "3 BHK" with 30 units).</p>
          
          <div className="form-row" style={{alignItems: 'flex-end'}}>
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={currentConfig.type} onChange={handleConfigChange}>
                <option value="Flat">Flat</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Plot">Plot</option>
                <option value="Commercial Plot">Commercial Plot</option>
                <option value="Shop">Shop</option>
              </select>
            </div>
            <div className="form-group">
              <label>Variant Name</label>
              <input type="text" name="variant" value={currentConfig.variant} onChange={handleConfigChange} placeholder="e.g. 2 BHK Luxury" />
            </div>
            <div className="form-group">
              <label>Size</label>
              <input type="text" name="size" value={currentConfig.size} onChange={handleConfigChange} placeholder="e.g. 1250 Sqft" />
            </div>
          </div>
          <div className="form-row" style={{marginTop: '10px'}}>
            <div className="form-group">
              <label>Price (₹)</label>
              <input type="number" name="basePrice" value={currentConfig.basePrice} onChange={handleConfigChange} placeholder="Base Price" />
            </div>
            <div className="form-group">
              <label>Total Units</label>
              <input type="number" name="totalUnits" value={currentConfig.totalUnits} onChange={handleConfigChange} placeholder="Total Inventory" />
            </div>
            <button type="button" onClick={handleAddConfig} style={{background: '#0284c7', color: 'white', border: 'none', padding: '0 20px', borderRadius: '6px', height: '42px', marginTop: 'auto'}}>Add +</button>
          </div>

          {/* List of Added Configurations */}
          {configurations.length > 0 && (
            <div style={{marginTop: '15px'}}>
              <h4 style={{fontSize: '0.9rem', marginBottom: '5px'}}>Added Units:</h4>
              <ul style={{listStyle: 'none', padding: 0}}>
                {configurations.map((conf, index) => (
                  <li key={index} style={{background: 'white', padding: '8px', marginBottom: '5px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e5e7eb'}}>
                    <span><b>{conf.variant}</b> ({conf.type}) - {conf.size} - ₹{conf.basePrice}</span>
                    <button type="button" onClick={() => handleRemoveConfig(index)} style={{color: 'red', background: 'none', border: 'none', cursor: 'pointer'}}>✖</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Infrastructure Section */}
          <div style={{marginTop: '20px', borderTop: '1px dashed #ccc', paddingTop: '15px'}}>
            <label style={{fontWeight: 'bold', color: '#0369a1'}}>🛣️ Project Infrastructure</label>
            <p style={{fontSize: '0.85rem', color: '#555'}}>Add key infrastructure details one by one.</p>
            
            <div className="form-row" style={{alignItems: 'flex-end', marginTop: '10px'}}>
                <div className="form-group">
                    <input type="text" value={currentInfra} onChange={(e) => setCurrentInfra(e.target.value)} placeholder="e.g., 40ft Wide Road" />
                </div>
                <button type="button" onClick={handleAddInfra} style={{background: '#0284c7', color: 'white', border: 'none', padding: '0 20px', borderRadius: '6px', height: '42px'}}>Add Infra +</button>
            </div>

            {/* List of Added Infrastructure */}
            {infrastructure.length > 0 && (
            <div style={{marginTop: '15px'}}>
              <h4 style={{fontSize: '0.9rem', marginBottom: '5px'}}>Added Infrastructure:</h4>
              <ul style={{listStyle: 'disc', paddingLeft: '20px'}}>
                {infrastructure.map((infra, index) => (
                  <li key={index} style={{marginBottom: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span>{infra}</span>
                    <button type="button" onClick={() => handleRemoveInfra(index)} style={{color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem'}}>×</button>
                  </li>
                ))}
              </ul>
            </div>
            )}
          </div>
        </div>
      ) : (
        // --- OWNER/AGENT SECTION (Single Property Fields) ---
        <>
          <div className="form-row">
            <div className="form-group">
              <label>Price (₹)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Property Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Land">Land</option>
                <option value="Commercial">Commercial</option>
                <option value="PG">PG / Paying Guest</option>
                <option value="Hostel">Hostel</option>
                <option value="Resort">Resort</option>
                <option value="Holiday Home">Holiday Home</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>BHK</label>
              <input type="number" name="bhk" value={formData.bhk} onChange={handleChange} placeholder="e.g. 2" />
            </div>
            <div className="form-group">
              <label>Area (sq ft)</label>
              <input type="number" name="area" value={formData.area} onChange={handleChange} required />
            </div>
          </div>
        </>
      )}

      <div className="form-group">
        <label>City</label>
        <input type="text" name="city" value={formData.city} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Address / Location</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} required />
      </div>

      {/* Map / Location Section */}
      <div className="form-group" style={{background: '#f9f9f9', padding: '15px', borderRadius: '8px'}}>
        <label style={{fontWeight: 'bold'}}>📍 Map Location</label>
        <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '10px'}}>Click the button to auto-detect your location or enter coordinates manually.</p>
        
        <button type="button" onClick={handleGetCurrentLocation} disabled={gettingLocation} style={{padding: '8px 15px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '10px', opacity: gettingLocation ? 0.7 : 1}}>
          {gettingLocation ? 'Detecting Location...' : 'Get Current Location'}
        </button>

        <div className="form-row">
          <div className="form-group">
            <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Latitude" />
          </div>
          <div className="form-group">
            <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Longitude" />
          </div>
        </div>
        
        {formData.latitude && formData.longitude && (
          <div style={{marginTop: '10px'}}>
            <a 
              href={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{color: '#2563eb', textDecoration: 'underline', fontSize: '0.9rem'}}
            >
              View Location on Google Maps ↗
            </a>
          </div>
        )}
      </div>

      {/* Image Upload Section */}
      <div className="form-group">
        <label>Upload Photos</label>
        <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
        {uploading && <p style={{color: 'blue'}}>Uploading images...</p>}
        
        <div className="image-previews" style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px'}}>
          {formData.images.map((url, index) => (
            <div key={index} style={{position: 'relative'}}>
                <img src={url} alt={`Preview ${index}`} style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px'}} />
            </div>
          ))}
        </div>
      </div>

      {/* Social Media & Video */}
      <div className="form-group">
        <label>YouTube Video URL</label>
        <input type="url" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="https://youtube.com/watch?v=..." />
      </div>

      <div className="form-group">
        <label>Virtual Tour Link</label>
        <input type="url" name="virtualTourLink" value={formData.virtualTourLink} onChange={handleChange} placeholder="https://my.matterport.com/show/..." />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Instagram Link</label>
          <input type="url" name="instagramUrl" value={formData.instagramUrl} onChange={handleChange} placeholder="https://instagram.com/..." />
        </div>
        <div className="form-group">
          <label>Facebook Link</label>
          <input type="url" name="facebookUrl" value={formData.facebookUrl} onChange={handleChange} placeholder="https://facebook.com/..." />
        </div>
      </div>

      <div className="form-group">
        <label>Amenities (comma separated)</label>
        <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} placeholder="WiFi, Gym, Parking, Pool" />
      </div>

      <button type="submit" className="submit-btn" disabled={loading || uploading} style={{width: '100%', padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', opacity: (loading || uploading) ? 0.7 : 1}}>
        {loading ? 'Listing Property...' : 'List Property'}
      </button>

      <style jsx>{`
        .add-property-form { display: flex; flex-direction: column; gap: 15px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .form-group { display: flex; flex-direction: column; gap: 5px; }
        .form-row { display: flex; gap: 15px; }
        .form-row .form-group { flex: 1; }
        label { font-weight: 500; font-size: 0.9rem; color: #374151; }
        input, select, textarea { padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1rem; }
        @media (max-width: 600px) { .form-row { flex-direction: column; gap: 15px; } }
      `}</style>
    </form>
  );
};

export default AddPropertyForm;