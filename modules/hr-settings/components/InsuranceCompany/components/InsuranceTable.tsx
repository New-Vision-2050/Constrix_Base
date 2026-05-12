"use client";

import React from "react";
import { useInsurance } from "../context/InsuranceContext";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Box, Typography, Button, Grid } from "@mui/material";
import { MedicalInsuranceRow } from "../types";

interface InsuranceTableProps {
  selectedInsurance?: MedicalInsuranceRow | null;
}

export default function InsuranceTable({ selectedInsurance }: InsuranceTableProps) {
  const { insurances } = useInsurance();
  const t = useTranslations("hr-settings.insurance");
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';

  const displayInsurances = selectedInsurance ? [selectedInsurance] : insurances;

  const cardBg = isDarkMode ? 'bg-[#251842]' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const secondaryTextColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-purple-800/30' : 'border-gray-200';
  const accentColor = '#8B5CF6';

  const renderInsuranceCard = (insurance: MedicalInsuranceRow) => (
    <Box
      key={insurance.id}
      className={`${cardBg} border ${borderColor} rounded-lg p-4`}
      sx={{ minWidth: 500, flex: "1 1 auto", maxWidth: "calc(50% - 8px)" }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold", color: textColor, mb: 3 }}>
        {insurance.name}
      </Typography>
      
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5, borderBottom: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : '#e5e7eb'}` }}>
          <Typography variant="body2" className={secondaryTextColor}>
            {t("serviceName") || "اسم الخدمة"}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "medium", color: textColor }}>
            {insurance.service_name || insurance.name}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5, borderBottom: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : '#e5e7eb'}` }}>
          <Typography variant="body2" className={secondaryTextColor}>
            {t("policyNumber") || "رقم البوليصة"}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "medium", color: textColor }}>
            {insurance.policy_number}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5, borderBottom: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : '#e5e7eb'}` }}>
          <Typography variant="body2" className={secondaryTextColor}>
            {t("serviceProvider") || "مزود الخدمة"}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "medium", color: textColor }}>
            {insurance.provider_name || insurance.employee_name || insurance.employee?.name || "-"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5, borderBottom: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : '#e5e7eb'}` }}>
          <Typography variant="body2" className={secondaryTextColor}>
            {t("startData") || "تاريخ البدء"}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "medium", color: textColor }}>
            {insurance.start_date || "-"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5, borderBottom: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : '#e5e7eb'}` }}>
          <Typography variant="body2" className={secondaryTextColor}>
            {t("endData") || "تاريخ الانتهاء"}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "medium", color: textColor }}>
            {insurance.end_date || "-"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5, borderBottom: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : '#e5e7eb'}` }}>
          <Typography variant="body2" className={secondaryTextColor}>
            {t("value") || "القيمة"}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "medium", color: textColor }}>
            {insurance.value ? `${insurance.value.toLocaleString()} ريال` : "-"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5 }}>
          <Typography variant="body2" className={secondaryTextColor}>
            {t("numberOfIndividuals") || "عدد الأفراد"}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "medium", color: textColor }}>
            {insurance.number_of_individuals ? `${insurance.number_of_individuals} فرد` : "-"}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: "#C084FC", 
            cursor: "pointer", 
            "&:hover": { textDecoration: "underline" } 
          }}
        >
          {t("viewDetails") || "عرض التفاصيل"}
        </Typography>
        <Button
          variant="contained"
          size="small"
          sx={{
            backgroundColor: accentColor,
            color: "white",
            "&:hover": {
              backgroundColor: "#7C3AED",
            },
          }}
        >
          {insurance.status === 1 ? (t("active") || "نشط") : (t("inactive") || "غير نشط")}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ flex: 1, pl: 2, overflow: "auto" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: textColor }}>
        {t("insuranceDetails") || "تفاصيل التأمين"}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {displayInsurances.map(renderInsuranceCard)}
      </Box>
    </Box>
  );
}
