import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_BASE = `${API_URL}/api`;

// Fetch all brokers
export const fetchBrokers = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/brokers`, { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching brokers:", error);
    throw error;
  }
};

// Get broker details by ID
export const fetchBrokerById = async (brokerId) => {
  try {
    const response = await axios.get(`${API_BASE}/brokers/${brokerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching broker details:", error);
    throw error;
  }
};

// Add new broker
export const addBroker = async (brokerData) => {
  try {
    const response = await axios.post(`${API_BASE}/brokers`, brokerData);
    return response.data;
  } catch (error) {
    console.error("Error adding broker:", error);
    throw error;
  }
};