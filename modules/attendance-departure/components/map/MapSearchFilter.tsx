"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";
import { useAttendance } from "../../context/AttendanceContext";

const MapSearchFilter: React.FC = () => {
  const { toggleView } = useAttendance();

  return (
    <div className="flex items-center justify-between w-full h-[60px] bg-[#140F35] rounded-lg px-4 gap-2">
      <div className="flex-grow">
        <Input
        placeholder="البحث"
        className="bg-[#21174A] text-white border-transparent h-[36px] rounded-md w-full placeholder:text-gray-400 focus:border-[#7453F0] focus:ring-[#7453F0] flex-grow"/>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          className="bg-[#FF3B8B] hover:bg-[#E61B70] text-white h-[36px] min-w-[100px] rounded-md"
          size="sm"
          onClick={() => toggleView("table")}
        >
          الجدول
        </Button>
        <Button variant="outline" size="sm" disabled>
          <Download className="mr-2 h-4 w-4" />
          تصدير
        </Button>
      </div>
    </div>
  );
};

export default MapSearchFilter;
