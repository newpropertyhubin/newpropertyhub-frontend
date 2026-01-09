import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API = axios.create({ baseURL: `${API_URL}/api` });

// Token middleware
API.interceptors.request.use((req) => {
  if (typeof window !== 'undefined' && localStorage.getItem("token")) {
    req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }
  return req;
});

// Create booking
export const createBooking = (data) => API.post("/bookings", data);

// Get my bookings
export const getMyBookings = () => API.get("/bookings/my");

// Update booking status (Admin)
export const updateBookingStatus = (id, status) =>
  API.put(`/bookings/${id}`, { status });