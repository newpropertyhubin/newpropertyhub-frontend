// frontend/src/api/InvestorApi.js
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_BASE = `${API_URL}/api`;

// Fetch all investors or with filters
export const fetchInvestors = async ({ city = "", type = "", budget = 0 } = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/investors`, {
      params: { city, type, budget },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching investors:", error);
    throw error;
  }
};

// Get single investor details
export const fetchInvestorById = async (investorId) => {
  try {
    const response = await axios.get(`${API_BASE}/investors/${investorId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching investor details:", error);
    throw error;
  }
};

// Add new investor (form submit)
export const addInvestor = async (investorData) => {
  try {
    const response = await axios.post(`${API_BASE}/investors`, investorData);
    return response.data;
  } catch (error) {
    console.error("Error adding investor:", error);
    throw error;
  }
};