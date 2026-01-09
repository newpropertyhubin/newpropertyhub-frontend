import Head from 'next/head';
import { useState } from 'react';
import { usePropertyTypes } from '../../hooks/usePropertyTypes.jsx'; // Sahi hook import karein
import AdminSidebar from '../../components/AdminSidebar.jsx';

const PropertyTypesAdminPage = () => {
  // Hook se data aur functions lein
  const { types, loading, addCustomType, removeCustomType } = usePropertyTypes();
  const [newType, setNewType] = useState('');
  const [message, setMessage] = useState('');

  const handleAddType = () => {
    const result = addCustomType(newType);
    setMessage(result.message);
    setNewType('');
  };

  const handleRemoveType = (type) => {
    const result = removeCustomType(type);
    setMessage(result.message);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Head>
        <title>Manage Property Types - Admin</title>
      </Head>

      <AdminSidebar />

      <main className="flex-1 p-8">
        <section className="bg-white p-6 rounded-lg shadow-md">
          {message && (
            <p style={{ padding: '1rem', background: '#eef2ff', borderRadius: '8px', marginBottom: '1rem' }}>{message}</p>
          )}
          <h1 className="text-2xl font-bold mb-4">Manage Property Types</h1>
          <div className="add-type-form" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              value={newType} 
              onChange={(e) => setNewType(e.target.value)} 
              placeholder="Add new property type"
              className="border p-2 rounded-md flex-grow"
            />
            <button onClick={handleAddType} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Add Type</button>
          </div>

          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 font-semibold text-gray-600">Type Name</th>
                <th className="p-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="2" className="p-3 text-center text-gray-500">Loading types...</td></tr>
              ) : (
                types.map(type => (
                <tr key={type} className="border-b hover:bg-gray-50">
                  <td className="p-3 capitalize">{type}</td>
                  <td className="p-3">
                    <button onClick={() => handleRemoveType(type)} className="text-red-500 hover:text-red-700 font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default PropertyTypesAdminPage;