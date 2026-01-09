import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API = axios.create({ baseURL: `${API_URL}/api/upload` });

export const uploadIdProof = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await API.post("/id-proof", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data.url;
};

export const uploadPropertyImages = async (files) => {
  const formData = new FormData();
  for (let f of files) formData.append("files", f);
  const { data } = await API.post("/property-images", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data.urls;
};