import React from "react";
import Link from "next/link";

export default function BusinessCard({ business }) {
  return (
    <div className="border rounded-xl shadow p-4">
      <img src={business.images?.[0]} alt="Business" className="h-40 w-full object-cover rounded" />
      <h2 className="text-lg font-semibold mt-2">{business.title}</h2>
      <p className="text-sm text-gray-600">{business.category}</p>
      <Link href={`/business/${business.slug}`} className="text-blue-500 mt-2 inline-block">
        View Details →
      </Link>
    </div>
  );
}