import Link from "next/link";
import AdminSidebar from "../components/AdminSidebar";
import styles from '../styles/dashboard.module.css';

export default function AdminDashboard() {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className={`${styles.container} flex-1`}>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card for Approving Properties */}
          <Link href="/approve-properties" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow block no-underline">
            <h2 className="text-xl font-semibold text-gray-800">Approve Properties</h2>
            <p className="text-gray-600 mt-2">Review and approve new property listings.</p>
          </Link>
          {/* Card for Approving Posts */}
          <Link href="/approve-posts" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow block no-underline">
            <h2 className="text-xl font-semibold text-gray-800">Approve Posts</h2>
            <p className="text-gray-600 mt-2">Moderate and approve new community posts.</p>
          </Link>
          {/* Card for Managing Amenities */}
          <Link href="/manage-amenities" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow block no-underline">
            <h2 className="text-xl font-semibold text-gray-800">Manage Amenities</h2>
            <p className="text-gray-600 mt-2">Add or remove property amenities.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
