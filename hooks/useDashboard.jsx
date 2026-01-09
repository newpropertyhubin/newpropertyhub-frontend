/**
 * Custom hooks for dashboard data fetching
 * Connects frontend dashboards to backend APIs with Firebase integration
 */

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Initialize axios with base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const api = axios.create({ baseURL: API_BASE_URL });

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Hook for Admin Dashboard
 */
export const useAdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/admin');
      if (response.data.success) {
        setData(response.data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setData, setError]);

  useEffect(() => {
    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const updateStats = async (newStats) => {
    try {
      const response = await api.post('/dashboard/admin', newStats);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const approvePayment = async (paymentId) => {
    try {
      const response = await api.post(`/dashboard/approve/${paymentId}`);
      if (response.data.success) {
        await fetchData();
        return true;
      }
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const rejectPayment = async (paymentId) => {
    try {
      const response = await api.post(`/dashboard/reject/${paymentId}`);
      if (response.data.success) {
        await fetchData();
        return true;
      }
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return { data, loading, error, updateStats, approvePayment, rejectPayment, refetch: fetchData };
};

/**
 * Hook for Builder Dashboard
 */
export const useBuilderDashboard = (builderId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/dashboard/builder/${builderId}`);
      if (response.data.success) {
        setData(response.data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching builder dashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setLoading, builderId, setData, setError]);

  useEffect(() => {
    if (builderId) {
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [builderId, fetchData]);

  const updateStats = async (newStats) => {
    try {
      const response = await api.post(`/dashboard/builder/${builderId}`, newStats);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const addProject = async (projectData) => {
    try {
      // Update local data with new project
      setData(prev => ({
        ...prev,
        projects: [...(prev?.projects || []), projectData],
        totalProjects: (prev?.totalProjects || 0) + 1,
      }));
      // Sync with backend
      await updateStats(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return { data, loading, error, updateStats, addProject, refetch: fetchData };
};

/**
 * Hook for Owner Dashboard
 */
export const useOwnerDashboard = (ownerId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/dashboard/owner/${ownerId}`);
      if (response.data.success) {
        setData(response.data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching owner dashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setLoading, ownerId, setData, setError]);

  useEffect(() => {
    if (ownerId) {
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [ownerId, fetchData]);

  const updateStats = async (newStats) => {
    try {
      const response = await api.post(`/dashboard/owner/${ownerId}`, newStats);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const addBooking = async (bookingData) => {
    try {
      setData(prev => ({
        ...prev,
        bookings: [...(prev?.bookings || []), bookingData],
        totalBookings: (prev?.totalBookings || 0) + 1,
      }));
      await updateStats(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const confirmBooking = async (bookingId) => {
    try {
      setData(prev => ({
        ...prev,
        bookings: (prev?.bookings || []).map(b =>
          b.id === bookingId ? { ...b, status: 'confirmed' } : b
        ),
      }));
      await updateStats(data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return { data, loading, error, updateStats, addBooking, confirmBooking, refetch: fetchData };
};

/**
 * Hook for User Dashboard
 */
export const useUserDashboard = (userId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/dashboard/user/${userId}`);
      if (response.data.success) {
        setData(response.data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching user dashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setLoading, userId, setData, setError]);

  useEffect(() => {
    if (userId) {
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [userId, fetchData]);

  const updateStats = async (newStats) => {
    try {
      const response = await api.post(`/dashboard/user/${userId}`, newStats);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const saveProperty = async (propertyData) => {
    try {
      setData(prev => ({
        ...prev,
        saved: [...(prev?.saved || []), propertyData],
        savedProperties: (prev?.savedProperties || 0) + 1,
      }));
      await updateStats(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const createAlert = async (alertData) => {
    try {
      setData(prev => ({
        ...prev,
        alerts: [...(prev?.alerts || []), alertData],
        activeAlerts: (prev?.activeAlerts || 0) + 1,
      }));
      await updateStats(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return { data, loading, error, updateStats, saveProperty, createAlert, refetch: fetchData };
};

/**
 * Hook for Analytics Dashboard
 */
export const useAnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/analytics');
      if (response.data.success) {
        setData(response.data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setData, setError]);

  useEffect(() => {
    fetchData();
    // Refresh every 60 seconds for analytics
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const updateAnalytics = async (newAnalytics) => {
    try {
      const response = await api.post('/dashboard/analytics', newAnalytics);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return { data, loading, error, updateAnalytics, refetch: fetchData };
};

/**
 * Hook for Firebase image/video upload
 */
export const useFirebaseUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file, folderPath = 'uploads') => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folderPath', folderPath);

      const response = await api.post('/upload/firebase', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setProgress(percent);
        },
      });

      if (response.data.success) {
        return {
          success: true,
          url: response.data.data.url,
          fileName: response.data.data.fileName,
          filePath: response.data.data.filePath,
        };
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      return { success: false, message: err.message };
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const uploadMultiple = async (files, folderPath = 'uploads') => {
    try {
      setUploading(true);
      const uploadPromises = files.map((file, index) =>
        uploadFile(file, folderPath).then(() => {
          setProgress(Math.round(((index + 1) / files.length) * 100));
        })
      );

      const results = await Promise.all(uploadPromises);
      return {
        success: true,
        uploads: results,
      };
    } catch (err) {
      console.error('Error uploading multiple files:', err);
      return { success: false, message: err.message };
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return { uploadFile, uploadMultiple, uploading, progress };
};

export default {
  useAdminDashboard,
  useBuilderDashboard,
  useOwnerDashboard,
  useUserDashboard,
  useAnalyticsDashboard,
  useFirebaseUpload,
};
