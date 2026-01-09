import { useState, useEffect } from 'react';

const DEFAULT_PROPERTY_TYPES = [
  'apartment',
  'house',
  'villa',
  'commercial',
  'land',
  'pg',
  'farmhouse',
  'hostel',
  'resort',
  'farmland',
  'bungalow',
];

export const usePropertyTypes = () => {
  const [types, setTypes] = useState(DEFAULT_PROPERTY_TYPES);
  const [loading, setLoading] = useState(true);

  // Load custom types from localStorage on mount
  useEffect(() => {
    try {
      const customTypes = localStorage.getItem('customPropertyTypes');
      if (customTypes) {
        const parsed = JSON.parse(customTypes);
        const allTypes = [...new Set([...DEFAULT_PROPERTY_TYPES, ...parsed])];
        setTypes(allTypes);
      } else {
        setTypes(DEFAULT_PROPERTY_TYPES);
      }
    } catch (err) {
      console.error('Error loading property types:', err);
      setTypes(DEFAULT_PROPERTY_TYPES);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCustomType = (newType) => {
    const normalizedType = newType.toLowerCase().trim();
    
    if (!normalizedType) {
      return { success: false, message: 'Type cannot be empty' };
    }
    
    if (types.includes(normalizedType)) {
      return { success: false, message: 'This type already exists' };
    }

    const updatedTypes = [...types, normalizedType];
    setTypes(updatedTypes);

    // Save custom types (exclude defaults)
    const customTypes = updatedTypes.filter(
      (t) => !DEFAULT_PROPERTY_TYPES.includes(t)
    );
    localStorage.setItem('customPropertyTypes', JSON.stringify(customTypes));

    return {
      success: true,
      message: `Added "${normalizedType}" as a new property type!`,
    };
  };

  const removeCustomType = (typeToRemove) => {
    const normalizedType = typeToRemove.toLowerCase();
    
    if (DEFAULT_PROPERTY_TYPES.includes(normalizedType)) {
      return { success: false, message: 'Cannot remove default property types' };
    }

    const updatedTypes = types.filter((t) => t !== normalizedType);
    setTypes(updatedTypes);

    // Update localStorage
    const customTypes = updatedTypes.filter(
      (t) => !DEFAULT_PROPERTY_TYPES.includes(t)
    );
    localStorage.setItem('customPropertyTypes', JSON.stringify(customTypes));

    return { success: true, message: `Removed "${typeToRemove}"` };
  };

  return {
    types,
    loading,
    addCustomType,
    removeCustomType,
    hasCustomTypes:
      types.length > DEFAULT_PROPERTY_TYPES.length,
    customTypes: types.filter(
      (t) => !DEFAULT_PROPERTY_TYPES.includes(t)
    ),
  };
};

export default usePropertyTypes;
