import React, { useState } from "react";

const BusinessForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    location: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="business-form">
      <input
        type="text"
        name="name"
        placeholder="Business Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="category"
        placeholder="Category (Hotel, Resort, etc.)"
        value={formData.category}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="location"
        placeholder="City / Area"
        value={formData.location}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <button type="submit">Submit Business</button>
    </form>
  );
};

export default BusinessForm;