import Link from 'next/link';

export default function PropertyCard({ property }) {
    // Agar property data nahi hai to error se bachne ke liye null return karein
    if (!property) return null;

    // Handle _id (from database) or id
    const propertyId = property._id || property.id;

    return (
        <div className="card property-card" style={{ border: '1px solid #eee', borderRadius: '12px', padding: '1rem', background: 'white', listStyle: 'none' }}>
            {/* Next.js me img tag use kar rahe hain, aap chahein to <Image /> use kar sakte hain */}
            <img 
                src={property.image || "https://placehold.co/600x400/EEE/31343C?text=Property"} 
                alt={property.title || "Property"} 
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
            />
            
            <div className="card-body">
                <h3 className="property-title" style={{ fontSize: '1.25rem', margin: '0 0 0.5rem' }}>{property.title}</h3>
                <p className="property-meta" style={{ color: '#6b7280', margin: '0 0 0.5rem' }}>
                    {property.location} {property.area && `• ${property.area}`}
                </p>
                <p className="property-price" style={{ fontWeight: 'bold', color: '#4f46e5', fontSize: '1.1rem', marginBottom: '1rem' }}>{property.price}</p>
                
                <div className="card-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                    {/* Dynamic Link */}
                    <Link href={`/property/${propertyId}`} style={{ flex: 1, textAlign: 'center', padding: '0.5rem', background: '#f3f4f6', color: '#1f2937', textDecoration: 'none', borderRadius: '6px', fontWeight: '500' }}>View Details</Link>
                    {/* External Link for WhatsApp */}
                    {property.contact && <a href={`https://wa.me/${property.contact}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: 'center', padding: '0.5rem', background: '#4f46e5', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: '500' }}>Contact</a>}
                </div>
            </div>
        </div>
    );
}