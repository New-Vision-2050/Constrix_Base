import React from "react";

interface CoordinatesInputProps {
  longitude: string;
  latitude: string;
  radius: string;
  onLongitudeChange: (value: string) => void;
  onLatitudeChange: (value: string) => void;
  onRadiusChange: (value: string) => void;
}

export default function CoordinatesInput({
  longitude,
  latitude,
  radius,
  onLongitudeChange,
  onLatitudeChange,
  onRadiusChange,
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
      <div className="col-span-2">
        <label className="block text-white text-sm mb-2">مسافة الحضور (متر):</label>
        <input
          type="number"
          value={radius}
          onChange={(e) => onRadiusChange(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-pink-500 focus:outline-none"
          placeholder="100"
          min="0"
        />
      </div>
    </div>
  );
}
