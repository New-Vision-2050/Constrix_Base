import React from "react";

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-4"></div>
      <span className="text-white text-sm">جاري التحميل...</span>
    </div>
  );
}
