"use client";

import React from "react";
import { useInsurance } from "../context/InsuranceContext";
import { useTranslations } from "next-intl";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import { ChevronRight } from "lucide-react";
import { MedicalInsuranceRow } from "../types";

interface InsuranceSidebarProps {
  onInsuranceSelect: (insurance: MedicalInsuranceRow) => void;
}

export default function InsuranceSidebar({ onInsuranceSelect }: InsuranceSidebarProps) {
  const { insurances, selectedInsurance } = useInsurance();
  const t = useTranslations("hr-settings.insurance");

  return (
    <Box sx={{ width: 300, borderRight: "1px solid #e0e0e0", pr: 2, height: "100%", overflowY: "auto" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        {t("title") || "جميع التأمينات"}
      </Typography>

      {insurances.length === 0 ? (
        <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", mt: 4 }}>
          {t("noInsurances") || "لا توجد تأمينات"}
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {insurances.map((insurance) => (
            <Card
              key={insurance.id}
              sx={{
                cursor: "pointer",
                transition: "all 0.2s",
                border: selectedInsurance?.id === insurance.id ? "2px solid #7c3aed" : "1px solid #e0e0e0",
                "&:hover": {
                  boxShadow: 2,
                  borderColor: "#7c3aed",
                },
              }}
              onClick={() => onInsuranceSelect(insurance)}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {insurance.name}
                  </Typography>
                  <IconButton size="small">
                    <ChevronRight size={16} />
                  </IconButton>
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                  {insurance.policy_number}
                </Typography>
                <Typography variant="caption" sx={{ color: insurance.status === 1 ? "green" : "red", mt: 1, display: "block" }}>
                  {insurance.status === 1 ? t("active") || "نشط" : t("inactive") || "غير نشط"}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
