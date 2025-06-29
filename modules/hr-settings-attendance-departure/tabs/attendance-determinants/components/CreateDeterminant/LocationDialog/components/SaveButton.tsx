import React from "react";

interface SaveButtonProps {
  onSave: () => void;
}

export default function SaveButton({ onSave }: SaveButtonProps) {
  return (
    <button
      onClick={onSave}
      className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 rounded-lg transition-colors"
    >
      حفظ
    </button>
  );
}
