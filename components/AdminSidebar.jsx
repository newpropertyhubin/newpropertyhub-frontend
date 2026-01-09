import React from "react";
import Link from "next/link";

const AdminSidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4 space-y-3">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <nav className="flex flex-col gap-2">
        <Link href="/admin-dashboard" className="hover:bg-gray-700 p-2 rounded block no-underline text-white">Dashboard</Link>
        <Link href="/approve-properties" className="hover:bg-gray-700 p-2 rounded block no-underline text-white">Approve Properties</Link>
        <Link href="/approve-posts" className="hover:bg-gray-700 p-2 rounded block no-underline text-white">Approve Posts</Link>
        <Link href="/manage-amenities" className="hover:bg-gray-700 p-2 rounded block no-underline text-white">Manage Amenities</Link>
        <Link href="/admin/property-types" className="hover:bg-gray-700 p-2 rounded block no-underline text-white">Manage Property Types</Link>
        <Link href="/admin/admin-map-settings" className="hover:bg-gray-700 p-2 rounded block no-underline text-white">Map Settings</Link>
      </nav>
    </div>
  );
};

export default AdminSidebar