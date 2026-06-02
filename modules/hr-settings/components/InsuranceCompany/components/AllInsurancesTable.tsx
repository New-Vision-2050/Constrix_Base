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
  currentTab?: number;
}

export default function AllInsurancesTable({ onInsuranceSelect, onTabChange, selectedInsurance, currentTab }: AllInsurancesTableProps) {
  const { insurances } = useInsurance();
  const t = useTranslations("hr-settings.insurance");
  
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
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
    <div className={`${containerBg} rounded-lg overflow-hidden shadow-sm border w-[300px] flex flex-col flex-shrink-0 ${isDarkMode ? 'border-purple-900/20' : 'border-gray-200'}`} style={{ maxHeight: 'calc(100vh - 200px)' }}>
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
        className="flex-1 overflow-y-scroll custom-scrollbar"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: isDarkMode ? '#6B7280 #2A1F4E' : '#9CA3AF #E5E7EB',
          height: 'calc(100vh - 280px)',
          minHeight: '200px',
        }}
      >
        {insurances.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className={`${inactiveTextTitle} text-sm`}>
              {t("noInsurances") || "لا توجد تأمينات"}
            </div>
          </div>
        ) : (
          insurances.map((insurance, index) => (
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
