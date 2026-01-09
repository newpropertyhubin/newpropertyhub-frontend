import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API = axios.create({ baseURL: `${API_URL}/api` });

API.interceptors.request.use((req) => {
  if (typeof window !== 'undefined' && localStorage.getItem("token")) {
    req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }
  return req;
});

// Amenities
export const addAmenity = (data) => API.post("/admin/amenities", data);

// Approve property
export const approveProperty = (id) => API.put(`/admin/property/${id}/approve`);

// Approve post
export const approvePost = (id) => API.put(`/admin/post/${id}/approve`);