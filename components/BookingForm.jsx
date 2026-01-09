import React, { useState } from 'react';
import axios from 'axios';

const BookingForm = ({ propertyId, propertyType, propertyTitle, pricePerNight = 0, onBookingComplete }) => {
  const [step, setStep] = useState(1); // 1: Dates, 2: Details, 3: Confirm, 4: Payment
  const [formData, setFormData] = useState({
    checkInDate: null,
    checkOutDate: null,
    numberOfGuests: 1,
    userName: '',
    userEmail: '',
    userPhone: '',
    specialRequests: '',
  });
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const calculateTotal = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    const nights = Math.ceil((formData.checkOutDate - formData.checkInDate) / (1000 * 60 * 60 * 24));
    return nights * pricePerNight * 1.18; // 18% GST
  };

  const calculateNights = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    return Math.ceil((formData.checkOutDate - formData.checkInDate) / (1000 * 60 * 60 * 24));
  };

  const handleCreateBooking = async () => {
    setLoading(true);
    setError('');
    try {
      const nights = calculateNights();
      const subtotal = nights * pricePerNight;
      const totalAmount = subtotal * 1.18;

      const response = await axios.post('/api/bookings/special/create', {
        propertyId,
        propertyType,
        userId: localStorage.getItem('userId') || 'guest-' + Date.now(),
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPhone: formData.userPhone,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        numberOfGuests: formData.numberOfGuests,
        totalAmount: Math.round(totalAmount),
        specialRequests: formData.specialRequests,
      });

      if (response.data.success) {
        setBookingData(response.data.data);
        setStep(3); // Move to confirmation
        setSuccessMessage('✅ Booking created! Please confirm and proceed with payment.');
      }
    } catch (err) {
      setError('❌ Error creating booking: ' + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };


  const validateStep2 = () => {
    if (!formData.userName.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.userEmail.trim() || !formData.userEmail.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    if (!formData.userPhone.trim() || formData.userPhone.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }
    return true;
  };

  return (
    <div style={styles.container}>
      {/* Step Indicator */}
      <div style={styles.stepIndicator}>
        <div style={{ ...styles.step, ...{ backgroundColor: step >= 1 ? '#667eea' : '#ddd' } }}>
          <span style={styles.stepNumber}>1</span>
          <span style={styles.stepLabel}>Dates</span>
        </div>
        <div style={{ ...styles.stepLine, ...{ backgroundColor: step >= 2 ? '#667eea' : '#ddd' } }}></div>
        <div style={{ ...styles.step, ...{ backgroundColor: step >= 2 ? '#667eea' : '#ddd' } }}>
          <span style={styles.stepNumber}>2</span>
          <span style={styles.stepLabel}>Details</span>
        </div>
        <div style={{ ...styles.stepLine, ...{ backgroundColor: step >= 3 ? '#667eea' : '#ddd' } }}></div>
        <div style={{ ...styles.step, ...{ backgroundColor: step >= 3 ? '#667eea' : '#ddd' } }}>
          <span style={styles.stepNumber}>3</span>
          <span style={styles.stepLabel}>Confirm</span>
        </div>
        <div style={{ ...styles.stepLine, ...{ backgroundColor: step >= 4 ? '#667eea' : '#ddd' } }}></div>
        <div style={{ ...styles.step, ...{ backgroundColor: step >= 4 ? '#667eea' : '#ddd' } }}>
          <span style={styles.stepNumber}>4</span>
          <span style={styles.stepLabel}>Complete</span>
        </div>
      </div>

      {/* Step 1: Date Selection */}
      {step === 1 && (
        <div style={styles.stepContent}>
          <h3 style={styles.stepTitle}>Select Your Dates</h3>
          <p style={styles.propertyInfo}>{propertyTitle} • {propertyType}</p>
          <p style={styles.priceInfo}>₹{pricePerNight.toLocaleString()} per night</p>
          
          <div style={styles.dateInputs}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Check-in Date:</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, checkInDate: new Date(e.target.value) })}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Check-out Date:</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, checkOutDate: new Date(e.target.value) })}
                style={styles.input}
              />
            </div>
          </div>

          {formData.checkInDate && formData.checkOutDate && (
            <div style={styles.priceBreakdown}>
              <div style={styles.breakdownRow}>
                <span>Nights: {calculateNights()}</span>
                <span>₹{pricePerNight.toLocaleString()} × {calculateNights()}</span>
              </div>
              <div style={styles.breakdownRow}>
                <span>Subtotal:</span>
                <span>₹{(pricePerNight * calculateNights()).toLocaleString()}</span>
              </div>
              <div style={styles.breakdownRow}>
                <span>GST (18%):</span>
                <span>₹{Math.round((pricePerNight * calculateNights() * 0.18)).toLocaleString()}</span>
              </div>
              <div style={styles.totalRow}>
                <span>Total:</span>
                <span style={styles.totalAmount}>₹{Math.round(calculateTotal()).toLocaleString()}</span>
              </div>
            </div>
          )}

          {error && <div style={styles.error}>{error}</div>}

          <button
            onClick={() => {
              if (formData.checkInDate && formData.checkOutDate) {
                setError('');
                setStep(2);
              } else {
                setError('Please select both check-in and check-out dates');
              }
            }}
            style={styles.buttonPrimary}
          >
            Continue →
          </button>
        </div>
      )}

      {/* Step 2: Guest Details */}
      {step === 2 && (
        <div style={styles.stepContent}>
          <h3 style={styles.stepTitle}>Your Details</h3>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name *</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address *</label>
            <input
              type="email"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleInputChange}
              placeholder="Enter your email"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number *</label>
            <input
              type="tel"
              name="userPhone"
              value={formData.userPhone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Number of Guests</label>
            <input
              type="number"
              name="numberOfGuests"
              value={formData.numberOfGuests}
              onChange={handleInputChange}
              min="1"
              max="10"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Special Requests (Optional)</label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              placeholder="Any special requests? (e.g., Late check-in, Extra bed, etc.)"
              style={{ ...styles.input, minHeight: '100px', fontFamily: 'inherit' }}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.buttonGroup}>
            <button onClick={() => setStep(1)} style={styles.buttonSecondary}>
              ← Back
            </button>
            <button
              onClick={() => {
                if (validateStep2()) {
                  setError('');
                  setStep(3);
                }
              }}
              style={styles.buttonPrimary}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div style={styles.stepContent}>
          <h3 style={styles.stepTitle}>Confirm Your Booking</h3>

          <div style={styles.confirmationBox}>
            <h4 style={styles.sectionTitle}>📍 Property Details</h4>
            <div style={styles.confirmationRow}>
              <span>Property:</span>
              <strong>{propertyTitle}</strong>
            </div>
            <div style={styles.confirmationRow}>
              <span>Type:</span>
              <strong>{propertyType.toUpperCase()}</strong>
            </div>

            <h4 style={styles.sectionTitle}>📅 Booking Details</h4>
            <div style={styles.confirmationRow}>
              <span>Check-in:</span>
              <strong>{formData.checkInDate?.toLocaleDateString()}</strong>
            </div>
            <div style={styles.confirmationRow}>
              <span>Check-out:</span>
              <strong>{formData.checkOutDate?.toLocaleDateString()}</strong>
            </div>
            <div style={styles.confirmationRow}>
              <span>Nights:</span>
              <strong>{calculateNights()}</strong>
            </div>
            <div style={styles.confirmationRow}>
              <span>Guests:</span>
              <strong>{formData.numberOfGuests}</strong>
            </div>

            <h4 style={styles.sectionTitle}>👤 Guest Information</h4>
            <div style={styles.confirmationRow}>
              <span>Name:</span>
              <strong>{formData.userName}</strong>
            </div>
            <div style={styles.confirmationRow}>
              <span>Email:</span>
              <strong>{formData.userEmail}</strong>
            </div>
            <div style={styles.confirmationRow}>
              <span>Phone:</span>
              <strong>{formData.userPhone}</strong>
            </div>

            {formData.specialRequests && (
              <>
                <h4 style={styles.sectionTitle}>📝 Special Requests</h4>
                <div style={styles.confirmationRow}>
                  <span></span>
                  <strong>{formData.specialRequests}</strong>
                </div>
              </>
            )}

            <div style={{ ...styles.confirmationRow, ...styles.priceBreakdown, marginTop: '15px' }}>
              <div>
                <div style={styles.breakdownRow}>
                  <span>Subtotal (₹{pricePerNight} × {calculateNights()} nights):</span>
                  <span>₹{(pricePerNight * calculateNights()).toLocaleString()}</span>
                </div>
                <div style={styles.breakdownRow}>
                  <span>GST (18%):</span>
                  <span>₹{Math.round((pricePerNight * calculateNights() * 0.18)).toLocaleString()}</span>
                </div>
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Total Amount:</span>
                  <span style={styles.totalAmount}>₹{Math.round(calculateTotal()).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.cancellationPolicy}>
            <strong>Cancellation Policy:</strong> 80% refund up to 7 days before check-in, 50% refund after
          </div>

          {error && <div style={styles.error}>{error}</div>}
          {successMessage && <div style={styles.success}>{successMessage}</div>}

          <div style={styles.buttonGroup}>
            <button onClick={() => setStep(2)} style={styles.buttonSecondary}>
              ← Back
            </button>
            <button
              onClick={handleCreateBooking}
              disabled={loading}
              style={{ ...styles.buttonPrimary, opacity: loading ? 0.6 : 1 }}
            >
              {loading ? '⏳ Creating...' : 'Proceed to Payment →'}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Complete */}
      {step === 4 && (
        <div style={styles.stepContent}>
          <div style={styles.successBox}>
            <div style={styles.successIcon}>✅</div>
            <h3 style={styles.successTitle}>Booking Confirmed!</h3>
            <p style={styles.successMessage}>Your booking has been successfully confirmed.</p>

            {bookingData && (
              <div style={styles.bookingDetails}>
                <div style={styles.detailItem}>
                  <span>Booking ID:</span>
                  <strong style={{ fontSize: '18px', color: '#667eea' }}>{bookingData.bookingId}</strong>
                </div>
                <div style={styles.detailItem}>
                  <span>Total Amount Paid:</span>
                  <strong>₹{Math.round(calculateTotal()).toLocaleString()}</strong>
                </div>
                <p style={styles.confirmationText}>
                  A confirmation email has been sent to <strong>{formData.userEmail}</strong>
                </p>
              </div>
            )}

            <button
              onClick={() => {
                // Redirect or close modal
                if (onBookingComplete) {
                  onBookingComplete('success');
                }
              }}
              style={{ ...styles.buttonPrimary, width: '100%' }}
            >
              Close & Return to Property
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '30px',
    padding: '0 10px',
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px',
    padding: '8px 12px',
    borderRadius: '50%',
    color: 'white',
    fontWeight: 'bold',
    width: '50px',
    height: '50px',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  stepNumber: {
    fontSize: '16px',
  },
  stepLabel: {
    fontSize: '10px',
  },
  stepLine: {
    flex: 1,
    height: '3px',
    margin: '0 5px',
  },
  stepContent: {
    minHeight: '300px',
  },
  stepTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '10px',
  },
  propertyInfo: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '5px',
  },
  priceInfo: {
    fontSize: '14px',
    color: '#667eea',
    fontWeight: '600',
    marginBottom: '20px',
  },
  dateInputs: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginBottom: '20px',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s',
  },
  priceBreakdown: {
    backgroundColor: '#f0f4ff',
    borderLeft: '4px solid #667eea',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  breakdownRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#666',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '10px',
    borderTop: '1px solid #ddd',
    marginTop: '10px',
    fontSize: '15px',
  },
  totalLabel: {
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontWeight: '700',
    color: '#667eea',
    fontSize: '16px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '25px',
  },
  buttonPrimary: {
    flex: 1,
    padding: '12px 20px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonSecondary: {
    flex: 1,
    padding: '12px 20px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '15px',
    fontSize: '14px',
    borderLeft: '4px solid #c62828',
  },
  success: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '15px',
    fontSize: '14px',
    borderLeft: '4px solid #2e7d32',
  },
  confirmationBox: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #e0e0e0',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#333',
    marginTop: '15px',
    marginBottom: '10px',
    borderBottom: '1px solid #ddd',
    paddingBottom: '8px',
  },
  confirmationRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '14px',
    color: '#666',
  },
  cancellationPolicy: {
    backgroundColor: '#fffce0',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#666',
    marginBottom: '20px',
    borderLeft: '4px solid #fbc02d',
  },
  successBox: {
    textAlign: 'center',
    padding: '30px 20px',
  },
  successIcon: {
    fontSize: '64px',
    marginBottom: '15px',
  },
  successTitle: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: '10px',
  },
  successMessage: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '25px',
  },
  bookingDetails: {
    backgroundColor: '#f0f4ff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'left',
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    fontSize: '14px',
  },
  confirmationText: {
    fontSize: '13px',
    color: '#666',
    marginTop: '15px',
  },
};

export default BookingForm;
