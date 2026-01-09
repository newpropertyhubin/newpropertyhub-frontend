import React, { useState, useEffect, useCallback } from 'react';

const AdminVanyaPanel = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editMode, setEditMode] = useState(false);
  const [vanyaSettings, setVanyaSettings] = useState({
    personalityTone: 'professional',
    suggestionsCount: 5,
    learningEnabled: true,
    autoRespond: true,
  });
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    totalConversations: 0,
    activeUsers: 0,
    averageSessionLength: 0,
    preferencesCaptured: 0,
  });

  const calculateStats = useCallback((convList) => {
    const stats = {
      totalConversations: convList.length,
      activeUsers: Math.floor(convList.length * 0.8),
      averageSessionLength: Math.round(convList.reduce((sum, c) => sum + c.messageCount, 0) / convList.length),
      preferencesCaptured: convList.filter(c => Object.keys(c.preferences).length > 0).length,
    };
    setStats(stats);
  }, [setStats]);

  const fetchVanyaConversations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Mock API call - replace with actual endpoint
      const mockConversations = [
        {
          userId: 'user-1',
          userName: 'Rahul Kumar',
          userEmail: 'rahul@example.com',
          lastMessage: 'Looking for 2BHK in Delhi under 50 lakhs',
          lastMessageTime: new Date(Date.now() - 3600000),
          messageCount: 8,
          preferences: { location: 'Delhi', bhk: '2', maxPrice: 5000000 },
          suggestedProperties: 3,
        },
        {
          userId: 'user-2',
          userName: 'Priya Singh',
          userEmail: 'priya@example.com',
          lastMessage: 'Can you show luxury apartments with gym and pool?',
          lastMessageTime: new Date(Date.now() - 7200000),
          messageCount: 5,
          preferences: { location: 'Mumbai', propertyType: 'luxury', amenities: ['gym', 'pool'] },
          suggestedProperties: 2,
        },
        {
          userId: 'user-3',
          userName: 'Amit Patel',
          userEmail: 'amit@example.com',
          lastMessage: 'Interested in PG near Metro Station',
          lastMessageTime: new Date(Date.now() - 86400000),
          messageCount: 12,
          preferences: { location: 'Gurgaon', propertyType: 'pg', amenities: ['metro-near'] },
          suggestedProperties: 5,
        },
      ];
      setConversations(mockConversations);
      calculateStats(mockConversations);
    } catch (err) {
      setError('Failed to fetch conversations: ' + err.message);
    }
    setLoading(false);
  }, [setLoading, setError, setConversations, calculateStats]);

  useEffect(() => {
    fetchVanyaConversations();
    loadVanyaSettings();
  }, [fetchVanyaConversations]);

  const loadVanyaSettings = async () => {
    try {
      // Load from localStorage or API
      const saved = localStorage.getItem('vanyaSettings');
      if (saved) {
        setVanyaSettings(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  const saveVanyaSettings = async () => {
    try {
      localStorage.setItem('vanyaSettings', JSON.stringify(vanyaSettings));
      alert('✅ Settings saved successfully');
      setEditMode(false);
    } catch (err) {
      alert('Error saving settings: ' + err.message);
    }
  };

  const handleViewConversation = (conv) => {
    setSelectedConversation(conv);
    setShowModal(true);
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'active' && conv.messageCount > 5) return matchesSearch;
    if (filterType === 'learning' && Object.keys(conv.preferences).length > 0) return matchesSearch;
    
    return matchesSearch;
  });

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🤖 Vanya AI Assistant Management</h1>
        <p style={styles.subtitle}>Monitor conversations, adjust AI settings, and improve recommendations</p>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.totalConversations}</div>
          <div style={styles.statLabel}>Total Conversations</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: '#4caf50' }}>{stats.activeUsers}</div>
          <div style={styles.statLabel}>Active Users</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: '#2196f3' }}>{stats.averageSessionLength}</div>
          <div style={styles.statLabel}>Avg Messages/Session</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: '#ff9800' }}>{stats.preferencesCaptured}</div>
          <div style={styles.statLabel}>Preferences Captured</div>
        </div>
      </div>

      {/* Vanya Settings */}
      <div style={styles.settingsSection}>
        <div style={styles.settingsHeader}>
          <h3 style={styles.sectionTitle}>⚙️ Vanya AI Settings</h3>
          <button
            onClick={() => setEditMode(!editMode)}
            style={{ ...styles.btn, backgroundColor: editMode ? '#f44336' : '#667eea' }}
          >
            {editMode ? 'Cancel' : 'Edit Settings'}
          </button>
        </div>

        {editMode ? (
          <div style={styles.settingsForm}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Personality Tone:</label>
              <select
                value={vanyaSettings.personalityTone}
                onChange={(e) => setVanyaSettings({ ...vanyaSettings, personalityTone: e.target.value })}
                style={styles.input}
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Suggestions per Conversation:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={vanyaSettings.suggestionsCount}
                onChange={(e) => setVanyaSettings({ ...vanyaSettings, suggestionsCount: parseInt(e.target.value) })}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <input
                  type="checkbox"
                  checked={vanyaSettings.learningEnabled}
                  onChange={(e) => setVanyaSettings({ ...vanyaSettings, learningEnabled: e.target.checked })}
                  style={styles.checkbox}
                />
                Enable Preference Learning
              </label>
              <p style={styles.helpText}>Allow Vanya to learn and improve recommendations from user interactions</p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <input
                  type="checkbox"
                  checked={vanyaSettings.autoRespond}
                  onChange={(e) => setVanyaSettings({ ...vanyaSettings, autoRespond: e.target.checked })}
                  style={styles.checkbox}
                />
                Auto-Respond to Common Queries
              </label>
              <p style={styles.helpText}>Automatically respond to frequently asked questions</p>
            </div>

            <button
              onClick={saveVanyaSettings}
              style={{ ...styles.btn, backgroundColor: '#4caf50', width: '100%', marginTop: '15px' }}
            >
              ✓ Save Settings
            </button>
          </div>
        ) : (
          <div style={styles.settingsDisplay}>
            <div style={styles.settingItem}>
              <span style={styles.settingLabel}>Personality Tone:</span>
              <span style={styles.settingValue}>{vanyaSettings.personalityTone}</span>
            </div>
            <div style={styles.settingItem}>
              <span style={styles.settingLabel}>Suggestions per Conversation:</span>
              <span style={styles.settingValue}>{vanyaSettings.suggestionsCount}</span>
            </div>
            <div style={styles.settingItem}>
              <span style={styles.settingLabel}>Preference Learning:</span>
              <span style={styles.settingValue}>{vanyaSettings.learningEnabled ? '✓ Enabled' : '✗ Disabled'}</span>
            </div>
            <div style={styles.settingItem}>
              <span style={styles.settingLabel}>Auto-Respond:</span>
              <span style={styles.settingValue}>{vanyaSettings.autoRespond ? '✓ Enabled' : '✗ Disabled'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Search and Filter */}
      <div style={styles.filterSection}>
        <input
          type="text"
          placeholder="🔍 Search conversations by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="all">All Conversations</option>
          <option value="active">Active Users</option>
          <option value="learning">Learning Preferences</option>
        </select>
      </div>

      {/* Error Message */}
      {error && <div style={styles.errorMessage}>{error}</div>}

      {/* Conversations Grid */}
      <div style={styles.conversationsGrid}>
        {loading ? (
          <p style={styles.loadingText}>⏳ Loading conversations...</p>
        ) : filteredConversations.length === 0 ? (
          <p style={styles.emptyText}>📭 No conversations found</p>
        ) : (
          filteredConversations.map((conv) => (
            <div key={conv.userId} style={styles.convCard}>
              <div style={styles.cardHeader}>
                <h4 style={styles.convName}>👤 {conv.userName}</h4>
                <span style={styles.timeAgo}>{getTimeAgo(conv.lastMessageTime)}</span>
              </div>

              <div style={styles.cardBody}>
                <p style={styles.email}>{conv.userEmail}</p>
                
                <div style={styles.messagePreview}>
                  <span style={styles.previewLabel}>Last Message:</span>
                  <p style={styles.previewText}>"{conv.lastMessage}"</p>
                </div>

                <div style={styles.statsRow}>
                  <div style={styles.statItem}>
                    <span style={styles.statIcon}>💬</span>
                    <span>{conv.messageCount} messages</span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statIcon}>🎯</span>
                    <span>{conv.suggestedProperties} suggestions</span>
                  </div>
                </div>

                {Object.keys(conv.preferences).length > 0 && (
                  <div style={styles.preferences}>
                    <span style={styles.prefsLabel}>Learned Preferences:</span>
                    <div style={styles.prefTags}>
                      {Object.entries(conv.preferences).map(([key, value]) => (
                        <span key={key} style={styles.prefTag}>
                          {key}: {Array.isArray(value) ? value.join(', ') : value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleViewConversation(conv)}
                style={styles.viewBtn}
              >
                View Full Conversation →
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal for Conversation Details */}
      {showModal && selectedConversation && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Conversation with {selectedConversation.userName}</h3>
              <button style={styles.closeButton} onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div style={styles.modalContent}>
              <div style={styles.userInfo}>
                <h4 style={styles.sectionTitle}>👤 User Information</h4>
                <div style={styles.infoPair}>
                  <span>Name:</span>
                  <strong>{selectedConversation.userName}</strong>
                </div>
                <div style={styles.infoPair}>
                  <span>Email:</span>
                  <strong>{selectedConversation.userEmail}</strong>
                </div>
                <div style={styles.infoPair}>
                  <span>Total Messages:</span>
                  <strong>{selectedConversation.messageCount}</strong>
                </div>
                <div style={styles.infoPair}>
                  <span>Properties Suggested:</span>
                  <strong>{selectedConversation.suggestedProperties}</strong>
                </div>
                <div style={styles.infoPair}>
                  <span>Last Message:</span>
                  <strong>{getTimeAgo(selectedConversation.lastMessageTime)}</strong>
                </div>
              </div>

              <div style={styles.preferences}>
                <h4 style={styles.sectionTitle}>🎯 Learned Preferences</h4>
                {Object.keys(selectedConversation.preferences).length > 0 ? (
                  <div style={styles.preferencesTable}>
                    {Object.entries(selectedConversation.preferences).map(([key, value]) => (
                      <div key={key} style={styles.prefRow}>
                        <span style={styles.prefKey}>{key}:</span>
                        <span style={styles.prefValue}>
                          {Array.isArray(value) ? value.join(', ') : value}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={styles.noPrefs}>No preferences captured yet</p>
                )}
              </div>

              <div style={styles.messagePreviewBox}>
                <h4 style={styles.sectionTitle}>💬 Recent Messages</h4>
                <p style={styles.lastMsg}>Last message from user:</p>
                <p style={styles.messageContent}>"{selectedConversation.lastMessage}"</p>
                <button style={{ ...styles.viewBtn, width: '100%', marginTop: '15px' }}>
                  View Full Chat History
                </button>
              </div>
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
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
  settingsSection: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '30px',
  },
  settingsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#333',
    margin: 0,
  },
  btn: {
    padding: '8px 16px',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  settingsForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  checkbox: {
    marginRight: '8px',
    cursor: 'pointer',
  },
  helpText: {
    fontSize: '12px',
    color: '#999',
    margin: '0',
  },
  settingsDisplay: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
  },
  settingItem: {
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  settingLabel: {
    fontSize: '13px',
    color: '#999',
    fontWeight: '500',
  },
  settingValue: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#333',
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
    minWidth: '180px',
    cursor: 'pointer',
  },
  errorMessage: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '15px',
    borderRadius: '6px',
    marginBottom: '20px',
    borderLeft: '4px solid #c62828',
  },
  conversationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  },
  loadingText: {
    textAlign: 'center',
    color: '#999',
    gridColumn: '1 / -1',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: '16px',
    gridColumn: '1 / -1',
  },
  convCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #eee',
  },
  convName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#333',
    margin: 0,
  },
  timeAgo: {
    fontSize: '12px',
    color: '#999',
  },
  cardBody: {
    flex: 1,
    marginBottom: '12px',
  },
  email: {
    fontSize: '13px',
    color: '#666',
    margin: '0 0 10px 0',
  },
  messagePreview: {
    marginBottom: '12px',
  },
  previewLabel: {
    fontSize: '12px',
    color: '#999',
    fontWeight: '600',
  },
  previewText: {
    fontSize: '13px',
    color: '#666',
    fontStyle: 'italic',
    margin: '6px 0 0 0',
    padding: '8px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
  },
  statsRow: {
    display: 'flex',
    gap: '15px',
    marginBottom: '12px',
    padding: '12px',
    backgroundColor: '#f0f4ff',
    borderRadius: '6px',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#666',
  },
  statIcon: {
    fontSize: '16px',
  },
  preferences: {
    marginBottom: '12px',
  },
  prefsLabel: {
    fontSize: '12px',
    color: '#999',
    fontWeight: '600',
  },
  prefTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '6px',
  },
  prefTag: {
    backgroundColor: '#e3f2fd',
    color: '#1565c0',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
  },
  viewBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
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
    maxHeight: '80vh',
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
  userInfo: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  infoPair: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px',
    fontSize: '14px',
    borderBottom: '1px solid #e0e0e0',
    marginBottom: '10px',
  },
  preferencesTable: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
  },
  prefRow: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px',
    fontSize: '14px',
    borderBottom: '1px solid #e0e0e0',
    marginBottom: '10px',
  },
  prefKey: {
    fontWeight: '600',
    color: '#333',
  },
  prefValue: {
    color: '#667eea',
  },
  noPrefs: {
    color: '#999',
    fontSize: '14px',
    margin: 0,
  },
  messagePreviewBox: {
    backgroundColor: '#f0f4ff',
    padding: '15px',
    borderRadius: '8px',
    borderLeft: '4px solid #667eea',
  },
  lastMsg: {
    fontSize: '12px',
    color: '#999',
    margin: '0 0 8px 0',
  },
  messageContent: {
    fontSize: '14px',
    color: '#666',
    fontStyle: 'italic',
    margin: 0,
    padding: '8px',
    backgroundColor: '#fff',
    borderRadius: '4px',
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

export default AdminVanyaPanel;
