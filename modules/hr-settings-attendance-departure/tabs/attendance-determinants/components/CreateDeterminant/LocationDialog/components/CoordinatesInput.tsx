import React from "react";

interface CoordinatesInputProps {
  longitude: string;
  latitude: string;
  onLongitudeChange: (value: string) => void;
  onLatitudeChange: (value: string) => void;
}

export default function CoordinatesInput({
  longitude,
  latitude,
  onLongitudeChange,
  onLatitudeChange,
}: CoordinatesInputProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block text-white text-sm mb-2">خط الطول:</label>
        <input
          type="text"
          value={longitude}
          onChange={(e) => onLongitudeChange(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-pink-500 focus:outline-none"
          placeholder="25.3253.486.4786.1"
        />
      </div>
      <div>
        <label className="block text-white text-sm mb-2">خط العرض:</label>
        <input
          type="text"
          value={latitude}
          onChange={(e) => onLatitudeChange(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-pink-500 focus:outline-none"
          placeholder="25.3253.486.4786.1"
        />
      </div>
    </div>
  );
}
