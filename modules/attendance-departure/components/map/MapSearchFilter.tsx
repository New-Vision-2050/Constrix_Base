"use client";

import React, { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";
import { useAttendance } from "../../context/AttendanceContext";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

const MapSearchFilter: React.FC = () => {
  const t = useTranslations("AttendanceDepartureModule.MapSearchFilter");
  const { toggleView, searchText, setSearchText } = useAttendance();
  
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Theme specific colors
  const containerBg = isDarkMode ? "#140F35" : "#f0f2f5";
  const inputBg = isDarkMode ? "#21174A" : "#ffffff";
  const inputBorderFocus = isDarkMode ? "#7453F0" : "#7453F0";
  const inputTextColor = isDarkMode ? "text-white" : "text-gray-800";
  const inputPlaceholderColor = isDarkMode ? "placeholder:text-gray-400" : "placeholder:text-gray-500";
  const searchIconColor = isDarkMode ? "#6b7280" : "#71717a";
  const outlineBtnBorder = isDarkMode ? "#2d3748" : "#d1d5db";
  const outlineBtnText = isDarkMode ? "#e2e8f0" : "#4b5563";
  
  // معالجة تغيير قيمة البحث
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, [setSearchText]);

  return (
    <div 
      className="flex items-center justify-between w-full h-[60px] rounded-lg px-4 gap-2"
      style={{ backgroundColor: `${containerBg} !important`}}
    >
      <div className="flex-grow relative">
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchText}
          onChange={handleSearchChange}
          className={`border-transparent h-[36px] rounded-md w-full ${inputTextColor} ${inputPlaceholderColor} flex-grow`}
          style={{ 
            backgroundColor: inputBg,
            borderColor: 'transparent',
          }}
        />
        <Search className="absolute left-3 top-[9px]" style={{ color: searchIconColor }} size={18} />
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
        <Button 
          variant="outline" 
          size="sm" 
          disabled
          className={isDarkMode ? "" : "border-gray-300 text-gray-600"}
          style={{ 
            borderColor: outlineBtnBorder,
            color: outlineBtnText 
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          {t("export")}
        </Button>
      </div>
    </div>
  );
};

export default MapSearchFilter;
