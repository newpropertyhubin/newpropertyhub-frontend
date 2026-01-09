import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_BASE = `${API_URL}/api/business`;

// 🔍 Fetch/Search businesses with filters
export const searchBusinesses = async (filters) => {
  // Backend expects 'area' for location/area filtering.
  const { category, area, sortBy } = filters;
  const res = await axios.get(`${API_BASE}/`, {
    params: { category, area, sortBy }
  });
  return res.data;
};