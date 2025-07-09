import React from "react";
import { X } from "lucide-react";

interface DialogHeaderProps {
  onClose: () => void;
}

export default function DialogHeader({ onClose }: DialogHeaderProps) {
  return (
    <div className="relative mb-6">
      <h2 className="text-xl font-bold text-white text-center">
        اختر إحداثيات الموقع
      </h2>
      <button
        onClick={onClose}
        className="absolute top-0 right-0 text-gray-400 hover:text-white transition-colors"
      >
        <X size={24} />
      </button>
    </div>
  );
}
