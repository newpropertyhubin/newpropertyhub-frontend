// frontend/src/api/PropertyApi.js

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_BASE = `${API_URL}/api`;

// ✅ Fetch all properties with optional filters and sorting
export const fetchProperties = async ({
  keyword = "",
  pincode = "",
  propertyType = "",
  minPrice = "",
  maxPrice = "",
  sortBy = "newest",
  pageNumber = 1,
} = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/properties`, {
      params: { keyword, pincode, propertyType, minPrice, maxPrice, sortBy, pageNumber },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};

// ✅ Fetch single property details by ID
export const fetchPropertyById = async (propertyId) => {
  try {
    const response = await axios.get(`${API_BASE}/properties/${propertyId}`);
    return response.data; // single property object
  } catch (error) {
    console.error("Error fetching property details:", error);
    throw error;
  }
};

// ✅ Search properties by keyword (city/type/area)
// TODO: Implement /api/properties/search route on the backend
// export const searchProperties = async (keyword, page = 1, limit = 20) => {
//   try {
//     const response = await axios.get(`${API_BASE}/properties/search`, {
//       params: { q: keyword, page, limit },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error searching properties:", error);
//     throw error;
//   }
// };

// ✅ Get nearby properties by latitude/longitude
// TODO: Implement /api/properties/nearby route on the backend
// export const fetchNearbyProperties = async (lat, lng, radius = 5, page = 1, limit = 20) => {
//   try {
//     const response = await axios.get(`${API_BASE}/properties/nearby`, {
//       params: { lat, lng, radius, page, limit },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching nearby properties:", error);
//     throw error;
//   }
// };

// ✅ Fetch similar properties (same city/type)
export const fetchSimilarProperties = async (propertyId) => {
  try {
    const response = await axios.get(`${API_BASE}/properties/similar/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching similar properties:", error);
    throw error;
  }
};