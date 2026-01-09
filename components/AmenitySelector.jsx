import React from "react";

const AmenitySelector = ({ amenities, selected, onChange }) => {
  const toggleAmenity = (amenity) => {
    if (selected.includes(amenity)) {
      onChange(selected.filter((a) => a !== amenity));
    } else {
      onChange([...selected, amenity]);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {amenities.map((a, idx) => (
        <label key={idx} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected.includes(a)}
            onChange={() => toggleAmenity(a)}
          />
          {a}
        </label>
      ))}
    </div>
  );
};

export default AmenitySelector;