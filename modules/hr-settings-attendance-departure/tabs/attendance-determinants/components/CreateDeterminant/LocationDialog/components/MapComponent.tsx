import React from "react";

interface MapComponentProps {
  selectedBranch: string;
  isDefaultLocation: boolean;
  latitude: string;
  longitude: string;
  onMapClick: (latitude: string, longitude: string) => void;
}

export default function MapComponent({
  selectedBranch,
  isDefaultLocation,
  latitude,
  longitude,
  onMapClick,
}: MapComponentProps) {
  
  // Handle map click to select new location
  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert click position to approximate coordinates (simplified)
    const newLat = (24.7136 + (y / rect.height - 0.5) * 0.1).toFixed(4);
    const newLng = (46.6753 + (x / rect.width - 0.5) * 0.1).toFixed(4);
    
    onMapClick(newLat, newLng);
  };
  return (
    <div className="mb-6">
      <div 
        className="bg-gray-200 rounded-lg h-64 relative overflow-hidden cursor-crosshair"
        onClick={handleMapClick}
        title="انقر لتحديد موقع جديد"
      >
        {/* Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
          {/* Map Grid Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <defs>
              <pattern
                id="grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="#666"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Location Marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-pink-500 rounded-full w-6 h-6 flex items-center justify-center">
            <div className="bg-white rounded-full w-2 h-2"></div>
          </div>
        </div>

        {/* Default Location Badge */}
        {isDefaultLocation && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-gray-800 bg-opacity-80 text-white px-3 py-1 rounded-full text-sm">
              الموقع الافتراضي
            </div>
          </div>
        )}

        {/* Map Controls */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <button className="bg-white shadow-md rounded p-2 hover:bg-gray-50">
            <span className="text-pink-500 font-bold">+</span>
          </button>
          <button className="bg-white shadow-md rounded p-2 hover:bg-gray-50">
            <span className="text-pink-500 font-bold">-</span>
          </button>
          <button className="bg-pink-500 text-white shadow-md rounded p-2 hover:bg-pink-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
