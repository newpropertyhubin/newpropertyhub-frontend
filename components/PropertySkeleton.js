const PropertySkeleton = () => (
    <div style={{ border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
        <div style={{ height: '200px', backgroundColor: '#e0e0e0', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
        <div style={{ padding: '1.5rem' }}>
            <div style={{ height: '24px', width: '80%', backgroundColor: '#e0e0e0', marginBottom: '1rem', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
            <div style={{ height: '16px', width: '60%', backgroundColor: '#e0e0e0', marginBottom: '0.5rem', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
            <div style={{ height: '16px', width: '40%', backgroundColor: '#e0e0e0', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
        </div>
        <style jsx>{`
            @keyframes pulse {
                0% { opacity: 0.6; }
                50% { opacity: 1; }
                100% { opacity: 0.6; }
            }
        `}</style>
    </div>
);

export default PropertySkeleton;