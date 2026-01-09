// src/pages/AddBusiness.jsx
import React, { useState } from "react";
import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";
import MediaUploader from "../components/MediaUploader";

const AddBusiness = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    area: "",
    contact: "",
    website: "",
  });
  const router = useRouter();
  const [media, setMedia] = useState({ images: [], videos: [] });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      
      // Append images and videos from MediaUploader
      media.images.forEach((file) => data.append("images", file));
      media.videos.forEach((file) => data.append("videos", file));

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/business`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Business successfully added!");
      setTimeout(() => router.push('/business-network'), 2000);
    } catch (err) {
      setMessage("❌ Error while adding business!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <Head>
        <title>Add Business - NewPropertyHub</title>
      </Head>
      <h1 className="text-2xl font-bold mb-4">Add Your Business</h1>

      {message && <p className="mb-4 text-center">{message}</p>}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 border p-4 rounded shadow"
      >
        <input
          type="text"
          name="title"
          placeholder="Business Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Business Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="category"
          placeholder="Category (Hotel, Resort, Industry, etc.)"
          value={formData.category}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="area"
          placeholder="Business Area/Location"
          value={formData.area}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="website"
          placeholder="Website Link (optional)"
          value={formData.website}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* Media Uploader Component */}
        <div className="mb-2">
          <h3 className="font-semibold mb-2">Upload Media</h3>
          <MediaUploader media={media} setMedia={setMedia} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Adding..." : "Add Business"}
        </button>
      </form>
    </div>
  );
};

export default AddBusiness;