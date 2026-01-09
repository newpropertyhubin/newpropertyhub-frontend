import React, { useEffect, useState } from "react";
import * as adminApi from "../services/adminApi"; // Use * as adminApi for named exports
import AdminSidebar from "../components/AdminSidebar"; // Sidebar add karein

const ApproveProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const { data } = await adminApi.getPendingProperties();
        setProperties(data);
      } catch (error) {
        console.error("Failed to fetch pending properties", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  const approve = async (id) => {
    await adminApi.approveProperty(id);
    // Bug Fix: MongoDB _id use karta hai, id nahi.
    setProperties(properties.filter((p) => p._id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Approve Properties</h1>
        {loading && <p>Loading properties to approve...</p>}
        {!loading && properties.length === 0 && <p>No properties are pending for approval.</p>}
        <div className="space-y-4">
          {properties.map((p) => (
            <div key={p._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img src={p.images?.[0] || 'https://via.placeholder.com/100'} alt={p.title} className="w-24 h-24 object-cover rounded-md" />
                <div>
                  <p className="font-bold text-lg">{p.title}</p>
                  <p className="text-sm text-gray-600">📍 {p.address?.city}, {p.address?.state}</p>
                  <p className="text-md font-semibold text-blue-600">₹{p.price?.toLocaleString()}</p>
                </div>
              </div>
              <button onClick={() => approve(p._id)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Approve
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ApproveProperties;