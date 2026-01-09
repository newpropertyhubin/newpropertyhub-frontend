console.log("booking.js loaded");

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Handle Booking Form Submission ---
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Form se data lena
            const propertyId = document.getElementById('propertyId')?.value;
            const checkIn = document.getElementById('checkIn')?.value;
            const checkOut = document.getElementById('checkOut')?.value;
            const adults = parseInt(document.getElementById('adults')?.value || 1);
            const children = parseInt(document.getElementById('children')?.value || 0);
            const bookingType = document.getElementById('bookingType')?.value || 'hotel'; 
            const totalPrice = document.getElementById('totalPrice')?.value; 

            // Basic Validation
            if (!propertyId || !checkIn || !checkOut) {
                alert('Please fill in all required fields (Check-in, Check-out).');
                return;
            }

            const bookingData = {
                property: propertyId,
                bookingType: bookingType,
                guests: {
                    adults: adults,
                    children: children
                },
                checkIn: checkIn,
                checkOut: checkOut,
                totalPrice: totalPrice
            };

            try {
                const token = localStorage.getItem('token'); // Token check
                if (!token) {
                    alert('Please login to book a property.');
                    window.location.href = '/login';
                    return;
                }

                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(bookingData)
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Booking request submitted successfully!');
                    // Success hone par dashboard ya confirmation page par bhejein
                    window.location.href = '/user-dashboard'; 
                } else {
                    alert(data.message || 'Booking failed. Please try again.');
                }
            } catch (error) {
                console.error('Error submitting booking:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    }

    // --- 2. Load User Bookings (Dashboard ke liye) ---
    const bookingsContainer = document.getElementById('myBookingsList');
    if (bookingsContainer) {
        loadUserBookings();
    }

    async function loadUserBookings() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('/api/bookings/my', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            
            if (response.ok && result.success) {
                renderBookings(result.data.bookings);
            } else {
                bookingsContainer.innerHTML = '<p>Failed to load bookings.</p>';
            }
        } catch (error) {
            console.error('Error loading bookings:', error);
            bookingsContainer.innerHTML = '<p>Error loading bookings.</p>';
        }
    }

    function renderBookings(bookings) {
        if (!bookings || bookings.length === 0) {
            bookingsContainer.innerHTML = '<p>No bookings found.</p>';
            return;
        }

        bookingsContainer.innerHTML = bookings.map(booking => `
            <div class="booking-card" style="border:1px solid #ddd; padding:15px; margin-bottom:10px; border-radius:8px;">
                <h3>${booking.property?.title || 'Property Unavailable'}</h3>
                <p><strong>Reference:</strong> ${booking.bookingReference}</p>
                <p><strong>Dates:</strong> ${new Date(booking.checkIn).toLocaleDateString()} - ${new Date(booking.checkOut).toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span class="status-${booking.bookingStatus}" style="font-weight:bold; text-transform:capitalize;">${booking.bookingStatus}</span></p>
                <p><strong>Total:</strong> ₹${booking.totalPrice}</p>
                ${(booking.bookingStatus === 'pending' || booking.bookingStatus === 'approved') ? 
                    `<button onclick="cancelBooking('${booking._id}')" class="btn-cancel" style="background:red; color:white; border:none; padding:5px 10px; cursor:pointer;">Cancel Booking</button>` : ''}
            </div>
        `).join('');
    }

    // --- 3. Cancel Booking Function (Global) ---
    window.cancelBooking = async (bookingId) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reason: 'User requested cancellation' })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Booking cancelled successfully.');
                loadUserBookings(); // List refresh karein
            } else {
                alert(data.message || 'Failed to cancel booking.');
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert('An error occurred.');
        }
    };
});