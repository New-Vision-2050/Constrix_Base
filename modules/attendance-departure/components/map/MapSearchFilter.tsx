"use client";

import React, { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";
import { useAttendance } from "../../context/AttendanceContext";
import { useTranslations } from "next-intl";

const MapSearchFilter: React.FC = () => {
  const t = useTranslations("AttendanceDepartureModule.MapSearchFilter");
  const { toggleView, searchText, setSearchText } = useAttendance();
  
  // معالجة تغيير قيمة البحث
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, [setSearchText]);

  return (
    <div className="flex items-center justify-between w-full h-[60px] bg-[#140F35] rounded-lg px-4 gap-2">
      <div className="flex-grow relative">
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchText}
          onChange={handleSearchChange}
          className="bg-[#21174A] text-white border-transparent h-[36px] rounded-md w-full placeholder:text-gray-400 focus:border-[#7453F0] focus:ring-[#7453F0] flex-grow"
        />
        <Search className="absolute left-3 top-[9px] text-gray-400" size={18} />
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          className="bg-[#FF3B8B] hover:bg-[#E61B70] text-white h-[36px] min-w-[100px] rounded-md"
          size="sm"
          onClick={() => toggleView("table")}
        >
          {t("tableView")}
        </Button>
        <Button variant="outline" size="sm" disabled>
          <Download className="mr-2 h-4 w-4" />
          {t("export")}
        </Button>
      </div>
    </div>
  );
};

export default MapSearchFilter;
