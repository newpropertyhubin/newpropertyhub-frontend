import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API = axios.create({ baseURL: `${API_URL}/api/payment` });

export const createOrder = (amount) => API.post("/create-order", { amount });
export const verifyPayment = (paymentData) => API.post("/verify-payment", paymentData);