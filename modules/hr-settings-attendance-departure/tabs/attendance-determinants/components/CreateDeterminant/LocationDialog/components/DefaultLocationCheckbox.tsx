import React from "react";

interface DefaultLocationCheckboxProps {
  isDefaultLocation: boolean;
  onChange: (isDefault: boolean) => void;
}

export default function DefaultLocationCheckbox({
  isDefaultLocation,
  onChange,
}: DefaultLocationCheckboxProps) {
  return (
    <div className="mb-6 flex justify-center">
      <label className="flex items-center text-white cursor-pointer">
        <input
          type="checkbox"
          checked={isDefaultLocation}
          onChange={(e) => onChange(e.target.checked)}
          className="mr-2 w-4 h-4 text-pink-500 bg-gray-700 border-gray-600 rounded focus:ring-pink-500 focus:ring-2"
        />
        <span className="text-sm">موقع الفرع الافتراضي</span>
      </label>
    </div>
  );
}
