import React, { useState, useCallback } from 'react';
import axios from 'axios';

const BookingComponent = ({ propertyId, propertyTitle, propertyType, pricePerNight }) => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [errors, setErrors] = useState({});

  const calculatePrice = useCallback(() => {
    if (checkInDate && checkOutDate && pricePerNight) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      if (nights > 0) {
        const total = nights * pricePerNight * numberOfRooms;
        setTotalPrice(total);
      }
    }
  }, [checkInDate, checkOutDate, pricePerNight, numberOfRooms, setTotalPrice]);

  React.useEffect(() => {
    calculatePrice();
  }, [checkInDate, checkOutDate, numberOfRooms, pricePerNight, calculatePrice]);

  const handleCheckAvailability = async () => {
    try {
      const response = await axios.post('/api/booking/check-availability', {
        propertyId,
        checkInDate,
        checkOutDate,
      });

      if (response.data.data.isAvailable) {
        setErrors({});
        alert('✅ Dates are available!');
      } else {
        setErrors({ availability: 'Dates not available. Try different dates.' });
      }
    } catch (error) {
      setErrors({ availability: error.message });
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!checkInDate) newErrors.checkInDate = 'Check-in date required';
    if (!checkOutDate) newErrors.checkOutDate = 'Check-out date required';
    if (!numberOfGuests) newErrors.numberOfGuests = 'Number of guests required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/booking/create', {
        userId: localStorage.getItem('userId') || 'guest_' + Date.now(),
        propertyId,
        propertyType,
        propertyTitle,
        checkInDate,
        checkOutDate,
        numberOfGuests,
        numberOfRooms,
        pricePerNight,
        totalPrice,
        specialRequests,
        userName: localStorage.getItem('userName') || 'Guest User',
        userEmail: localStorage.getItem('userEmail') || 'guest@example.com',
        userPhone: localStorage.getItem('userPhone') || '9876543210',
      });

      if (response.data.success) {
        setBookingId(response.data.data.bookingId);
        setErrors({});
        // Reset form
        setCheckInDate('');
        setCheckOutDate('');
        setNumberOfGuests('');
        setSpecialRequests('');
      }
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || error.message });
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '24px',
      border: '1px solid #e0e0e0',
    },
    title: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#333',
      marginBottom: '20px',
    },
    form: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '6px',
    },
    input: {
      padding: '10px 12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      fontFamily: 'inherit',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    inputError: {
      borderColor: '#ff6b6b',
    },
    error: {
      color: '#ff6b6b',
      fontSize: '12px',
      marginTop: '4px',
    },
    priceSection: {
      gridColumn: '1 / -1',
      backgroundColor: '#f9f9f9',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '16px',
    },
    priceRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
      fontSize: '14px',
    },
    priceTotal: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#667eea',
      paddingTop: '8px',
      borderTop: '1px solid #ddd',
    },
    buttonGroup: {
      gridColumn: '1 / -1',
      display: 'flex',
      gap: '12px',
      marginTop: '16px',
    },
    btn: {
      padding: '12px 24px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    checkBtn: {
      backgroundColor: '#f0f0f0',
      color: '#333',
      flex: 1,
    },
    bookBtn: {
      backgroundColor: '#667eea',
      color: 'white',
      flex: 2,
    },
    bookBtnDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    successMessage: {
      backgroundColor: '#e8f5e9',
      color: '#2e7d32',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '16px',
    },
    successText: {
      fontSize: '14px',
      fontWeight: '600',
    },
    bookingDetails: {
      fontSize: '13px',
      marginTop: '8px',
      color: '#1b5e20',
    },
  };

  if (bookingId) {
    return (
      <div style={styles.container}>
        <div style={styles.successMessage}>
          <div style={styles.successText}>✅ Booking Request Submitted!</div>
          <div style={styles.bookingDetails}>
            Booking ID: <strong>{bookingId}</strong><br />
            Total Amount: ₹{totalPrice.toLocaleString()}<br />
            You'll receive confirmation email shortly.
          </div>
        </div>
        <button
          onClick={() => {
            setBookingId(null);
            setCheckInDate('');
            setCheckOutDate('');
            setNumberOfGuests('');
          }}
          style={{ ...styles.btn, ...styles.checkBtn }}
        >
          Make Another Booking
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📅 Book {propertyTitle}</h3>

      {errors.submit && <div style={styles.error}>{errors.submit}</div>}
      {errors.availability && <div style={styles.error}>{errors.availability}</div>}

      <form onSubmit={handleBooking} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Check-in Date</label>
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            style={{
              ...styles.input,
              ...(errors.checkInDate && styles.inputError),
            }}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.checkInDate && <div style={styles.error}>{errors.checkInDate}</div>}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Check-out Date</label>
          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            style={{
              ...styles.input,
              ...(errors.checkOutDate && styles.inputError),
            }}
            min={checkInDate || new Date().toISOString().split('T')[0]}
          />
          {errors.checkOutDate && <div style={styles.error}>{errors.checkOutDate}</div>}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Number of Guests</label>
          <input
            type="number"
            value={numberOfGuests}
            onChange={(e) => setNumberOfGuests(e.target.value)}
            style={{
              ...styles.input,
              ...(errors.numberOfGuests && styles.inputError),
            }}
            min="1"
            max="10"
          />
          {errors.numberOfGuests && <div style={styles.error}>{errors.numberOfGuests}</div>}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Number of Rooms</label>
          <input
            type="number"
            value={numberOfRooms}
            onChange={(e) => setNumberOfRooms(parseInt(e.target.value))}
            style={styles.input}
            min="1"
            max="5"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Special Requests</label>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            style={{
              ...styles.input,
              minHeight: '80px',
              resize: 'vertical',
            }}
            placeholder="Any special requests, dietary preferences, etc."
          />
        </div>

        <div style={styles.priceSection}>
          <div style={styles.priceRow}>
            <span>₹{pricePerNight} × {numberOfRooms} room{numberOfRooms > 1 ? 's' : ''} × nights</span>
            <span>₹{(pricePerNight * numberOfRooms * Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)) || 0).toLocaleString()}</span>
          </div>
          <div style={styles.priceRow}>
            <span>Tax (18%)</span>
            <span>₹{(totalPrice * 0.18).toLocaleString()}</span>
          </div>
          <div style={{ ...styles.priceRow, ...styles.priceTotal }}>
            <span>Total Amount</span>
            <span>₹{(totalPrice * 1.18).toLocaleString()}</span>
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button
            type="button"
            onClick={handleCheckAvailability}
            disabled={!checkInDate || !checkOutDate}
            style={styles.checkBtn}
          >
            Check Availability
          </button>
          <button
            type="submit"
            disabled={loading || !checkInDate || !checkOutDate || !numberOfGuests}
            style={{
              ...styles.btn,
              ...styles.bookBtn,
              ...(loading && styles.bookBtnDisabled),
            }}
          >
            {loading ? '⏳ Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingComponent;
