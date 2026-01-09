"use client"; // Next.js client component

import { useState, useEffect } from 'react';

export default function BookingCard({ booking }) {
    // Provide default booking object if not present to avoid crashes.
    const safeBooking = booking || {}; 

    // State to manage status locally (Pending -> Approved/Cancelled)
    const [status, setStatus] = useState(safeBooking.status || 'pending');
    const [loading, setLoading] = useState(false);
    const [dateText, setDateText] = useState(safeBooking.date || ''); // Initial value raw date

    // Helper to format date relative to today
    useEffect(() => {
        if (booking.date) {
            const date = new Date(booking.date);
            const today = new Date();
            const diffTime = date - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            let text = date.toLocaleDateString();
            if (diffDays === 0) text += ' (Today)';
            else if (diffDays === 1) text += ' (Tomorrow)';
            else if (diffDays > 0) text += ` (In ${diffDays} days)`;
            setDateText(text);
        }
    }, [booking.date]);

    const handleBooking = async (action) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/bookings/${booking.id}/${action}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Uncomment if using token
                }
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.message || `Failed to ${action} booking`);

            // Update status on success
            setStatus(action === 'approve' ? 'approved' : 'cancelled');
            alert(`Booking ${action}d successfully!`); // Simple alert for now

        } catch (error) {
            console.error(`Error ${action}ing booking:`, error);
            alert(`Failed to ${action} booking: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <li className="card booking-card">
            <div className="card-body">
                <div className="booking-header">
                    <h3 className="booking-title">
                        <i className="fas fa-bookmark"></i>
                        Booking #{booking.id}
                    </h3>
                    <span className={`booking-status ${status.toLowerCase()}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                </div>
                
                <div className="booking-details">
                    <p className="booking-meta">
                        <i className="fas fa-building"></i>
                        Property: {booking.propertyName}
                    </p>
                    <p className="booking-meta">
                        <i className="fas fa-user"></i>
                        Guest: {booking.guestName}
                    </p>
                    <p className="booking-meta">
                        <i className="fas fa-info-circle"></i>
                        Source: <span style={{ fontWeight: '500', color: '#2563eb' }}>{booking.source || 'Online'}</span>
                    </p>
                    <p className="booking-date">
                        <i className="fas fa-calendar-alt"></i>
                        Date: {dateText}
                    </p>
                    <p className="booking-time">
                        <i className="fas fa-clock"></i>
                        Time: {booking.time}
                    </p>
                </div>

                {/* Only show buttons if status is pending */}
                {status === 'pending' && (
                    <div className="booking-actions">
                        <button 
                            className="btn btn-approve" 
                            onClick={() => handleBooking('approve')}
                            disabled={loading}
                        >
                            <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-check'}`}></i> Approve
                        </button>
                        <button 
                            className="btn btn-cancel" 
                            onClick={() => handleBooking('cancel')}
                            disabled={loading}
                        >
                            <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-times'}`}></i> Cancel
                        </button>
                    </div>
                )}
            </div>
        </li>
    );
}