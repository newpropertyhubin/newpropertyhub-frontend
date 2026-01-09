import React, { useEffect, useState } from "react";
import { getBusinessDetails } from "../services/businessApi";
import { useRouter } from "next/router";

const BusinessDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    if (!id) return; // Wait for ID to be available
    async function fetchData() {
      const res = await getBusinessDetails(id);
      setBusiness(res.data);
    }
    fetchData();
  }, [id]);

  if (!business) return <p>Loading...</p>;

  return (
    <div className="business-details-page">
      <h2>{business.name}</h2>
      <p>Category: {business.category}</p>
      <p>Location: {business.location}</p>
      <p>{business.description}</p>

      <div className="media-gallery">
        {business.images?.map((img, idx) => (
          <img key={idx} src={img} alt="business" width={200} />
        ))}
        {business.videos?.map((vid, idx) => (
          <video key={idx} width={250} controls>
            <source src={vid} type="video/mp4" />
          </video>
        ))}
      </div>
    </div>
  );
};

export default BusinessDetails;