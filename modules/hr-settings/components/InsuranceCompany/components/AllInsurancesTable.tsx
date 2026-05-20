"use client";

import React from "react";
import { useInsurance } from "../context/InsuranceContext";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { CheckCircle2Icon, AlertCircle, Shield, MapPin } from "lucide-react";
import { MedicalInsuranceRow } from "../types";

interface AllInsurancesTableProps {
  onInsuranceSelect?: (insurance: MedicalInsuranceRow | null) => void;
  onTabChange?: (tab: number) => void;
  selectedInsurance?: MedicalInsuranceRow | null;
  onPaginationChange?: (data: { currentPage: number; totalPages: number; startIndex: number; endIndex: number; total: number }) => void;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  currentTab?: number;
}

export default function AllInsurancesTable({ onInsuranceSelect, onTabChange, selectedInsurance, onPaginationChange, currentPage: externalCurrentPage, onPageChange: externalOnPageChange, itemsPerPage: externalItemsPerPage, currentTab }: AllInsurancesTableProps) {
  const { insurances } = useInsurance();
  const t = useTranslations("hr-settings.insurance");
  
  console.log("🔍 AllInsurancesTable - Total insurances:", insurances.length);
  console.log("🔍 AllInsurancesTable - Insurances:", insurances);
  if (insurances.length > 0) {
    console.log("🔍 First insurance data:", insurances[0]);
    console.log("🔍 First insurance keys:", Object.keys(insurances[0]));
  }
  const [internalCurrentPage, setInternalCurrentPage] = React.useState(1);
  const itemsPerPage = externalItemsPerPage || 10;
  
  // Use external page if provided, otherwise use internal
  const currentPage = externalCurrentPage !== undefined ? externalCurrentPage : internalCurrentPage;
  const setCurrentPage = externalOnPageChange || setInternalCurrentPage;
  
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Calculate pagination
  const totalPages = Math.ceil(insurances.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInsurances = insurances.slice(startIndex, endIndex);

  // Send pagination data to parent
  React.useEffect(() => {
    if (onPaginationChange) {
      onPaginationChange({
        currentPage,
        totalPages,
        startIndex,
        endIndex: Math.min(endIndex, insurances.length),
        total: insurances.length
      });
    }
  }, [currentPage, totalPages, startIndex, endIndex, insurances.length, onPaginationChange]);
  
  // Theme specific colors
  const containerBg = isDarkMode ? 'bg-[#1A103C]' : 'bg-white';
  const itemHoverBg = isDarkMode ? 'hover:bg-[#2A204C]' : 'hover:bg-gray-50';
  const selectedItemBg = isDarkMode ? 'bg-[#1A0F2E]' : 'bg-blue-100';
  const borderColor = isDarkMode ? 'border-gray-600 border-opacity-20' : 'border-gray-200';
  const activeTextTitle = isDarkMode ? 'text-white font-bold' : 'text-gray-900 font-bold';
  const inactiveTextTitle = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const iconColor = isDarkMode ? 'text-white' : 'text-blue-900';

  const handleAllInsurancesClick = () => {
    if (onInsuranceSelect) {
      onInsuranceSelect(null);
    }
  };

  const handleInsuranceClick = (insurance: MedicalInsuranceRow) => {
    if (onInsuranceSelect) {
      onInsuranceSelect(insurance);
    }
    // Only switch to policy data tab if no tab is currently selected (currentTab is undefined or null)
    // Otherwise, keep the current tab
    if (onTabChange && (currentTab === undefined || currentTab === null)) {
      onTabChange(0); // Switch to policy data tab only on first selection
    }
  };

  return (
    <div className={`${containerBg} rounded-lg overflow-hidden shadow-sm border w-fit min-w-[300px] h-full flex flex-col ${isDarkMode ? 'border-purple-900/20' : 'border-gray-200'}`}>
      {/* Header row for "All Insurances" */}
      <div
        className={`flex flex-row-reverse items-center justify-between py-4 border-b ${borderColor} cursor-pointer ${itemHoverBg} transition-colors`}
        onClick={handleAllInsurancesClick}
      >
        <div className="flex items-center justify-center">

        </div>
        <div className="flex flex-row-reverse items-center gap-2">
          <div className="text-right">
            <div className={`text-sm ${activeTextTitle}`}>
              {t('title')}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Shield size={20} className={iconColor} />
          </div>
        </div>
      </div>
      
      {/* Insurance items */}
      <div
        className="flex-1 overflow-y-auto custom-scrollbar"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: isDarkMode ? '#4B5563 transparent' : '#9CA3AF transparent',
        }}
      >
        {insurances.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className={`${inactiveTextTitle} text-sm`}>
              {t("noInsurances") || "لا توجد تأمينات"}
            </div>
          </div>
        ) : (
          paginatedInsurances.map((insurance, index) => (
            <div
              key={`${insurance.id}-${index}`}
              className={`flex flex-row-reverse items-center justify-between py-4 border-b ${borderColor} last:border-b-0 cursor-pointer ${itemHoverBg} transition-colors ${selectedInsurance?.id === insurance.id ? selectedItemBg : ''}`}
              onClick={() => handleInsuranceClick(insurance)}
            >
              <div className="flex items-center justify-center">
                {insurance.status === 1 ? (
                  <CheckCircle2Icon size={20} className="text-green-500" />
                ) : (
                  <AlertCircle size={20} className="text-orange-500" />
                )}
              </div>
              <div className="flex flex-row-reverse items-center gap-2">
                <div className="text-right">
                  <div className={`text-sm ${activeTextTitle}`}>
                    {insurance.name}
                  </div>
                  {insurance.policy_number && (
                    <div className={`text-xs ${inactiveTextTitle}`}>
                      {insurance.policy_number}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center">
                  <Shield size={20} className={iconColor} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
