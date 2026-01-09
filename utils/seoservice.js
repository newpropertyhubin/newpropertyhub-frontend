// frontend/src/api/SeoApi.js
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_BASE = `${API_URL}/api`;

// Fetch all cities for SEO purposes
export const fetchSeoCities = async () => {
  try {
    const response = await axios.get(`${API_BASE}/seo/cities`);
    return response.data;
  } catch (error) {
    console.error("Error fetching SEO cities:", error);
    throw error;
  }
};

// TODO: The following API calls do not have corresponding backend routes yet.
// // Generate SEO pages (trigger backend)
// export const generateSeoPages = async () => {
//   try {
//     const response = await axios.post(`${API_BASE}/seo/generate`);
//     return response.data;
//   } catch (error) {
//     console.error("Error generating SEO pages:", error);
//     throw error;
//   }
// };