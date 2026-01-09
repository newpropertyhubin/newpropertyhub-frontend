import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AdminBookingDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionReason, setActionReason] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
  });

  const calculateStats = useCallback((bookingList) => {
    const stats = {
      totalBookings: bookingList.length,
      confirmedBookings: bookingList.filter(b => b.status === 'confirmed').length,
      pendingBookings: bookingList.filter(b => b.status === 'pending').length,
      cancelledBookings: bookingList.filter(b => b.status === 'cancelled').length,
      totalRevenue: bookingList.reduce((sum, b) => sum + (b.status === 'confirmed' ? (b.totalAmount || 0) : 0), 0),
    };
    setStats(stats);
  }, [setStats]);

  const fetchAllBookings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/bookings/admin/all');
      if (response.data.data) {
        setBookings(response.data.data);
        calculateStats(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch bookings: ' + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  }, [setBookings, calculateStats, setLoading, setError]);

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  const handleApproveBooking = async (bookingId) => {
    try {
      const response = await axios.post(`/api/bookings/special/${bookingId}/confirm`, {
        paymentId: 'ADMIN_' + Date.now(),
        amountPaid: selectedBooking?.totalAmount,
      });
      
      if (response.data.success) {
        setBookings(bookings.map(b => b.bookingId === bookingId ? { ...b, status: 'confirmed' } : b));
        setShowModal(false);
        setSelectedBooking(null);
        alert('✅ Booking approved and confirmed');
        fetchAllBookings();
      }
    } catch (err) {
      alert('Error approving booking: ' + err.message);
    }
  };

  const handleRejectBooking = async (bookingId) => {
    if (!actionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    try {
      // Mock API call - replace with actual endpoint
      setBookings(bookings.map(b => b.bookingId === bookingId ? { ...b, status: 'cancelled' } : b));
      setShowModal(false);
      setSelectedBooking(null);
      setActionReason('');
      alert('✅ Booking rejected. Guest notification sent.');
      fetchAllBookings();
    } catch (err) {
      alert('Error rejecting booking: ' + err.message);
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      setBookings(bookings.map(b => b.bookingId === bookingId ? { ...b, status: 'completed' } : b));
      setShowModal(false);
      setSelectedBooking(null);
      alert('✅ Booking marked as completed');
      fetchAllBookings();
    } catch (err) {
      alert('Error completing booking: ' + err.message);
    }
  };

  const handleNoShow = async (bookingId) => {
    if (!actionReason.trim()) {
      alert('Please provide details about the no-show');
      return;
    }
    try {
      setBookings(bookings.map(b => b.bookingId === bookingId ? { ...b, status: 'no-show' } : b));
      setShowModal(false);
      setSelectedBooking(null);
      setActionReason('');
      alert('✅ Booking marked as no-show');
      fetchAllBookings();
    } catch (err) {
      alert('Error updating booking: ' + err.message);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#4caf50';
      case 'pending':
        return '#ff9800';
      case 'cancelled':
        return '#f44336';
      case 'completed':
        return '#2196f3';
      case 'no-show':
        return '#9c27b0';
      default:
        return '#999';
    }
  };

  const getStatusBadge = (status) => {
    const statusLabels = {
      confirmed: '✓ Confirmed',
      pending: '⏳ Pending',
      cancelled: '✕ Cancelled',
      completed: '✓ Completed',
      'no-show': '✗ No-Show',
    };
    return statusLabels[status] || status;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN');
  };

  const formatCurrency = (amount) => {
    return '₹' + (amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>📋 Booking Management Dashboard</h1>
        <p style={styles.subtitle}>Manage all property bookings, approvals, and cancellations</p>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.totalBookings}</div>
          <div style={styles.statLabel}>Total Bookings</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: '#4caf50' }}>{stats.confirmedBookings}</div>
          <div style={styles.statLabel}>Confirmed</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: '#ff9800' }}>{stats.pendingBookings}</div>
          <div style={styles.statLabel}>Pending</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: '#2196f3' }}>{stats.totalRevenue.toLocaleString()}</div>
          <div style={styles.statLabel}>Total Revenue</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div style={styles.filterSection}>
        <input
          type="text"
          placeholder="🔍 Search by Booking ID, Guest Name, Email or Phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No-Show</option>
        </select>
      </div>

      {/* Error Message */}
      {error && <div style={styles.errorMessage}>{error}</div>}

      {/* Bookings Table */}
      <div style={styles.tableContainer}>
        {loading ? (
          <p style={styles.loadingText}>⏳ Loading bookings...</p>
        ) : filteredBookings.length === 0 ? (
          <p style={styles.emptyText}>📭 No bookings found</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Booking ID</th>
                <th style={styles.th}>Guest Name</th>
                <th style={styles.th}>Property Type</th>
                <th style={styles.th}>Check-in</th>
                <th style={styles.th}>Check-out</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.bookingId} style={styles.tableRow}>
                  <td style={styles.td}>
                    <code style={styles.bookingId}>{booking.bookingId}</code>
                  </td>
                  <td style={styles.td}>
                    <div>
                      <strong>{booking.userName}</strong>
                      <div style={styles.smallText}>{booking.userEmail}</div>
                    </div>
                  </td>
                  <td style={styles.td}>{booking.propertyType.toUpperCase()}</td>
                  <td style={styles.td}>{formatDate(booking.checkInDate)}</td>
                  <td style={styles.td}>{formatDate(booking.checkOutDate)}</td>
                  <td style={styles.td}>
                    <strong>{formatCurrency(booking.totalAmount)}</strong>
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusBadgeColor(booking.status),
                      }}
                    >
                      {getStatusBadge(booking.status)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowModal(true);
                      }}
                      style={styles.actionButton}
                    >
                      ⚙️ Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for Booking Actions */}
      {showModal && selectedBooking && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Manage Booking</h3>
              <button style={styles.closeButton} onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div style={styles.modalContent}>
              <div style={styles.bookingInfo}>
                <h4 style={styles.infoTitle}>Booking Details</h4>
                <div style={styles.infoPair}>
                  <span>Booking ID:</span>
                  <strong>{selectedBooking.bookingId}</strong>
                </div>
                <div style={styles.infoPair}>
                  <span>Guest:</span>
                  <strong>{selectedBooking.userName}</strong>
                </div>
                <div style={styles.infoPair}>
                  <span>Email:</span>
                  <strong>{selectedBooking.userEmail}</strong>
                </div>
                <div style={styles.infoPair}>
                  <span>Phone:</span>
                  <strong>{selectedBooking.userPhone}</strong>
                </div>
                <div style={styles.infoPair}>
                  <span>Property Type:</span>
                  <strong>{selectedBooking.propertyType.toUpperCase()}</strong>
                </div>
                <div style={styles.infoPair}>
                  <span>Check-in:</span>
                  <strong>{formatDate(selectedBooking.checkInDate)}</strong>
                </div>
                <div style={styles.infoPair}>
                  <span>Check-out:</span>
                  <strong>{formatDate(selectedBooking.checkOutDate)}</strong>
                </div>
                <div style={styles.infoPair}>
                  <span>Total Amount:</span>
                  <strong style={styles.amountHighlight}>{formatCurrency(selectedBooking.totalAmount)}</strong>
                </div>
                <div style={styles.infoPair}>
                  <span>Current Status:</span>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusBadgeColor(selectedBooking.status),
                    }}
                  >
                    {getStatusBadge(selectedBooking.status)}
                  </span>
                </div>

                {selectedBooking.specialRequests && (
                  <div style={styles.infoPair}>
                    <span>Special Requests:</span>
                    <div style={styles.specialRequestsText}>{selectedBooking.specialRequests}</div>
                  </div>
                )}
              </div>

              {/* Action Section */}
              {selectedBooking.status === 'pending' && (
                <div style={styles.actionSection}>
                  <h4 style={styles.infoTitle}>⚙️ Actions for Pending Booking</h4>
                  <div style={styles.buttonGroup}>
                    <button
                      onClick={() => handleApproveBooking(selectedBooking.bookingId)}
                      style={{ ...styles.actionBtn, backgroundColor: '#4caf50' }}
                    >
                      ✓ Approve & Confirm
                    </button>
                    <button
                      onClick={() => {
                        if (actionReason.trim()) {
                          handleRejectBooking(selectedBooking.bookingId);
                        }
                      }}
                      style={{ ...styles.actionBtn, backgroundColor: '#f44336' }}
                    >
                      ✕ Reject
                    </button>
                  </div>
                  <textarea
                    placeholder="Reason (required for rejection)"
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    style={styles.reasonTextarea}
                  />
                </div>
              )}

              {selectedBooking.status === 'confirmed' && (
                <div style={styles.actionSection}>
                  <h4 style={styles.infoTitle}>⚙️ Actions for Confirmed Booking</h4>
                  <div style={styles.buttonGroup}>
                    <button
                      onClick={() => handleCompleteBooking(selectedBooking.bookingId)}
                      style={{ ...styles.actionBtn, backgroundColor: '#2196f3' }}
                    >
                      ✓ Mark as Completed
                    </button>
                    <button
                      onClick={() => {
                        if (actionReason.trim()) {
                          handleNoShow(selectedBooking.bookingId);
                        }
                      }}
                      style={{ ...styles.actionBtn, backgroundColor: '#9c27b0' }}
                    >
                      ✗ Mark as No-Show
                    </button>
                  </div>
                  <textarea
                    placeholder="Notes (required for no-show)"
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    style={styles.reasonTextarea}
                  />
                </div>
              )}

              {selectedBooking.status === 'completed' && (
                <div style={styles.actionSection}>
                  <div style={{ ...styles.infoAlert, backgroundColor: '#e8f5e9', borderLeft: '4px solid #4caf50' }}>
                    ✓ This booking has been completed successfully.
                  </div>
                </div>
              )}

              {selectedBooking.status === 'cancelled' && (
                <div style={styles.actionSection}>
                  <div style={{ ...styles.infoAlert, backgroundColor: '#ffebee', borderLeft: '4px solid #f44336' }}>
                    ✕ This booking has been cancelled.
                  </div>
                </div>
              )}

              {selectedBooking.status === 'no-show' && (
                <div style={styles.actionSection}>
                  <div style={{ ...styles.infoAlert, backgroundColor: '#f3e5f5', borderLeft: '4px solid #9c27b0' }}>
                    ✗ Guest did not show up for this booking.
                  </div>
                </div>
              )}
            </div>

            <div style={styles.modalFooter}>
              <button
                onClick={() => setShowModal(false)}
                style={styles.closeBtn}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    marginBottom: '30px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#333',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '15px',
    color: '#666',
    margin: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    transition: 'transform 0.3s',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#667eea',
    marginBottom: '10px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
  },
  filterSection: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: 1,
    minWidth: '250px',
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  filterSelect: {
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    minWidth: '150px',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  errorMessage: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '15px',
    borderRadius: '6px',
    marginBottom: '20px',
    borderLeft: '4px solid #c62828',
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  loadingText: {
    padding: '20px',
    textAlign: 'center',
    color: '#999',
  },
  emptyText: {
    padding: '40px',
    textAlign: 'center',
    color: '#999',
    fontSize: '16px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#667eea',
    color: 'white',
  },
  th: {
    padding: '15px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '600',
    borderBottom: '2px solid #667eea',
  },
  tableRow: {
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.2s',
  },
  td: {
    padding: '15px',
    fontSize: '14px',
    color: '#333',
  },
  bookingId: {
    backgroundColor: '#f0f0f0',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
  },
  smallText: {
    fontSize: '12px',
    color: '#999',
    marginTop: '3px',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
  },
  actionButton: {
    padding: '6px 12px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 5px 30px rgba(0,0,0,0.3)',
  },
  modalHeader: {
    padding: '20px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#333',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#999',
  },
  modalContent: {
    padding: '20px',
  },
  bookingInfo: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  infoTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#333',
    marginTop: '0',
    marginBottom: '12px',
    borderBottom: '2px solid #667eea',
    paddingBottom: '8px',
  },
  infoPair: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px',
    fontSize: '14px',
    borderBottom: '1px solid #e0e0e0',
    marginBottom: '10px',
  },
  amountHighlight: {
    fontSize: '16px',
    color: '#667eea',
    fontWeight: '700',
  },
  specialRequestsText: {
    backgroundColor: '#fff',
    padding: '8px',
    borderRadius: '4px',
    fontStyle: 'italic',
    color: '#666',
  },
  actionSection: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f0f4ff',
    borderRadius: '8px',
    borderLeft: '4px solid #667eea',
  },
  buttonGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '15px',
  },
  actionBtn: {
    padding: '10px 15px',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'opacity 0.2s',
  },
  reasonTextarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '13px',
    fontFamily: 'inherit',
    minHeight: '80px',
    boxSizing: 'border-box',
  },
  infoAlert: {
    padding: '12px',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#333',
  },
  modalFooter: {
    padding: '15px 20px',
    borderTop: '1px solid #eee',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  closeBtn: {
    padding: '10px 20px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
};

export default AdminBookingDashboard;
