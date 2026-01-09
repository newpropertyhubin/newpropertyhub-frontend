import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BookingCalendar = ({ propertyId, propertyType, pricePerNight = 0, onDatesSelected }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState([]);
  const [selectedCheckIn, setSelectedCheckIn] = useState(null);
  const [selectedCheckOut, setSelectedCheckOut] = useState(null);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchAvailableDates = useCallback(async () => {
    setLoading(true);
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3); // Check next 3 months

      const response = await axios.get(`/api/bookings/property/${propertyId}/available`, {
        params: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        }
      });

      if (response.data.data.bookedDates) {
        setBookedDates(response.data.data.bookedDates);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
    setLoading(false);
  }, [setLoading, setBookedDates, propertyId]);

  // Fetch booked dates on component mount
  useEffect(() => {
    fetchAvailableDates();
  }, [fetchAvailableDates, propertyId]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateBooked = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookedDates.includes(dateStr);
  };

  const isDateInRange = (date) => {
    if (!selectedCheckIn || !selectedCheckOut) return false;
    return date > selectedCheckIn && date < selectedCheckOut;
  };

  const handleDateClick = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    // Don't allow past dates or booked dates
    if (date < new Date() || isDateBooked(date)) return;

    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
      setSelectedCheckIn(date);
      setSelectedCheckOut(null);
    } else if (date > selectedCheckIn) {
      setSelectedCheckOut(date);
      // Call parent with selected dates
      const nights = Math.ceil((date - selectedCheckIn) / (1000 * 60 * 60 * 24));
      onDatesSelected({
        checkIn: selectedCheckIn,
        checkOut: date,
        nights,
        totalCost: nights * pricePerNight
      });
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isBooked = isDateBooked(date);
      const isInRange = isDateInRange(date);
      const isCheckIn = selectedCheckIn && date.toDateString() === selectedCheckIn.toDateString();
      const isCheckOut = selectedCheckOut && date.toDateString() === selectedCheckOut.toDateString();
      const isPast = date < new Date();

      days.push(
        <div
          key={day}
          className={`calendar-day ${isBooked ? 'booked' : ''} ${isInRange ? 'in-range' : ''} ${isCheckIn ? 'check-in' : ''} ${isCheckOut ? 'check-out' : ''} ${isPast ? 'past' : ''}`}
          onClick={() => handleDateClick(day)}
          style={{
            cursor: (isBooked || isPast) ? 'not-allowed' : 'pointer',
            opacity: (isBooked || isPast) ? 0.5 : 1,
          }}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const calculateNights = () => {
    if (selectedCheckIn && selectedCheckOut) {
      return Math.ceil((selectedCheckOut - selectedCheckIn) / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const totalCost = calculateNights() * pricePerNight;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Select Your Dates</h3>
        <p style={styles.subtitle}>{propertyType} • ₹{pricePerNight.toLocaleString()} per night</p>
      </div>

      <div style={styles.guestSection}>
        <label style={styles.label}>Number of Guests:</label>
        <input
          type="number"
          min="1"
          max="10"
          value={numberOfGuests}
          onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
          style={styles.input}
        />
      </div>

      <div style={styles.calendarWrapper}>
        <div style={styles.navigation}>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            style={styles.navButton}
          >
            ← Previous
          </button>
          <h4 style={styles.monthTitle}>{monthName}</h4>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            style={styles.navButton}
          >
            Next →
          </button>
        </div>

        <div style={styles.legend}>
          <div style={{ ...styles.legendItem, ...styles.availableColor }}>Available</div>
          <div style={{ ...styles.legendItem, ...styles.bookedColor }}>Booked</div>
          <div style={{ ...styles.legendItem, ...styles.selectedColor }}>Selected</div>
        </div>

        <div style={styles.weekdayLabels}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} style={styles.weekdayLabel}>{day}</div>
          ))}
        </div>

        <div style={styles.calendar}>
          {renderCalendar()}
        </div>
      </div>

      {selectedCheckIn && selectedCheckOut && (
        <div style={styles.priceBreakdown}>
          <h4 style={styles.breakdownTitle}>Price Breakdown</h4>
          <div style={styles.breakdownRow}>
            <span>Check-in: {selectedCheckIn.toLocaleDateString()}</span>
            <span>Check-out: {selectedCheckOut.toLocaleDateString()}</span>
          </div>
          <div style={styles.breakdownRow}>
            <span>Nights: {calculateNights()}</span>
            <span>₹{pricePerNight.toLocaleString()} × {calculateNights()} = ₹{(pricePerNight * calculateNights()).toLocaleString()}</span>
          </div>
          <div style={styles.breakdownRow}>
            <span>GST (18%):</span>
            <span>₹{Math.round((totalCost * 0.18)).toLocaleString()}</span>
          </div>
          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Total Amount:</span>
            <span style={styles.totalAmount}>₹{Math.round(totalCost * 1.18).toLocaleString()}</span>
          </div>
          <p style={styles.cancellationPolicy}>
            <strong>Cancellation Policy:</strong> 80% refund up to 7 days before check-in, 50% refund after
          </p>
        </div>
      )}

      {loading && <p style={styles.loading}>Loading calendar...</p>}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '20px',
    maxWidth: '600px',
    margin: '20px 0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    marginBottom: '20px',
    borderBottom: '2px solid #667eea',
    paddingBottom: '15px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 5px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  guestSection: {
    marginBottom: '20px',
    padding: '12px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    width: '80px',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  calendarWrapper: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  navButton: {
    padding: '8px 12px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  monthTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  legend: {
    display: 'flex',
    gap: '15px',
    marginBottom: '15px',
    fontSize: '12px',
    justifyContent: 'center',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '5px 10px',
    borderRadius: '4px',
  },
  availableColor: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  bookedColor: {
    backgroundColor: '#ffebee',
    color: '#c62828',
  },
  selectedColor: {
    backgroundColor: '#e3f2fd',
    color: '#1565c0',
  },
  weekdayLabels: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '5px',
    marginBottom: '10px',
  },
  weekdayLabel: {
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: '600',
    color: '#999',
    padding: '8px 0',
  },
  calendar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '5px',
  },
  calendarDay: {
    padding: '10px',
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '500',
    backgroundColor: '#fff',
  },
  priceBreakdown: {
    backgroundColor: '#f0f4ff',
    borderLeft: '4px solid #667eea',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '14px',
    lineHeight: '1.8',
  },
  breakdownTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
    margin: '0 0 10px 0',
  },
  breakdownRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    color: '#666',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '10px',
    borderTop: '1px solid #ddd',
    marginTop: '10px',
  },
  totalLabel: {
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontWeight: '700',
    fontSize: '16px',
    color: '#667eea',
  },
  cancellationPolicy: {
    fontSize: '12px',
    color: '#666',
    marginTop: '10px',
    marginBottom: 0,
  },
  loading: {
    textAlign: 'center',
    color: '#999',
    fontSize: '14px',
  },
};

export default BookingCalendar;
