// frontend/src/api/ReviewApi.js
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_BASE = `${API_URL}/api`;

// Fetch reviews for a specific target (e.g., property, broker)
export const fetchReviews = async (targetType, targetId) => {
  try {
    const response = await axios.get(`${API_BASE}/reviews/${targetType}/${targetId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

// Add new review
export const addReview = async (reviewData) => {
  try {
    const response = await axios.post(`${API_BASE}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};