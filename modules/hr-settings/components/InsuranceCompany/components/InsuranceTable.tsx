"use client";

import React, { useState, useRef, useEffect } from "react";
import { useInsurance } from "../context/InsuranceContext";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Box, Typography, Button, Grid, Dialog, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Menu, MenuItem } from "@mui/material";
import { X, UploadCloud, FileText, Plus, Edit } from "lucide-react";
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { MedicalInsuranceRow } from "../types";

interface InsuranceTableProps {
  selectedInsurance?: MedicalInsuranceRow | null;
  activeTab?: number;
  onInsuranceSelect?: (insurance: MedicalInsuranceRow) => void;
  onTabChange?: (tab: number) => void;
  categories?: any[];
  onEditCategory?: (category: any) => void;
  onEditEmployee?: (employee: any) => void;
  employees?: any[];
  onDeleteEmployee?: (employeeId: string) => void;
}

export default function InsuranceTable({ selectedInsurance, activeTab = 0, onInsuranceSelect, onTabChange, categories = [], onEditCategory, onEditEmployee, employees = [], onDeleteEmployee }: InsuranceTableProps) {
  const { insurances } = useInsurance();
  const t = useTranslations("hr-settings.insurance");
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Pagination state
  const [categoryPage, setCategoryPage] = React.useState(1);
  const itemsPerPage = 10;
  
  // Calculate pagination
  const totalCategoryPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (categoryPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = categories.slice(startIndex, endIndex);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [detailsInsurance, setDetailsInsurance] = useState<MedicalInsuranceRow | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset attachments and edited policy when selected insurance changes
  useEffect(() => {
    // If selectedInsurance has attachment URL, fetch it
    if (selectedInsurance?.attachment) {
      console.log("📎 Insurance has attachment:", selectedInsurance.attachment);
      // TODO: Fetch attachment from URL and add to attachments array
    } else {
      setAttachments([]);
    }
    setEditedPolicy(null);
    setIsEditingPolicy(false);
  }, [selectedInsurance?.id]);
  const [isEditingPolicy, setIsEditingPolicy] = useState(false);
  const [editedPolicy, setEditedPolicy] = useState<MedicalInsuranceRow | null>(null);
  const [editingAttachmentIndex, setEditingAttachmentIndex] = useState<number | null>(null);
  const [editedAttachmentName, setEditedAttachmentName] = useState<string>("");
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedEmployeeForAction, setSelectedEmployeeForAction] = useState<any>(null);

  const displayInsurances = selectedInsurance ? [selectedInsurance] : insurances;

  const handleOpenDetailsDialog = (insurance: MedicalInsuranceRow) => {
    if (onInsuranceSelect) {
      onInsuranceSelect(insurance);
    }
    if (onTabChange) {
      onTabChange(0);
    }
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setDetailsInsurance(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files);
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleEditPolicy = () => {
    if (isEditingPolicy) {
      setIsEditingPolicy(false);
      setEditedPolicy(null);
    } else {
      setIsEditingPolicy(true);
      setEditedPolicy(selectedInsurance ? { ...selectedInsurance } : null);
    }
  };

  const handleSavePolicy = () => {
    setIsEditingPolicy(false);
    setEditedPolicy(null);
  };

  const handleCancelEdit = () => {
    setIsEditingPolicy(false);
    setEditedPolicy(null);
  };

  const handlePolicyChange = (field: keyof MedicalInsuranceRow, value: any) => {
    if (isEditingPolicy && editedPolicy) {
      setEditedPolicy({ ...editedPolicy, [field]: value });
    } else if (selectedInsurance) {
      setEditedPolicy({ ...selectedInsurance, [field]: value });
    }
  };

  const handleEditAttachment = (index: number) => {
    setEditingAttachmentIndex(index);
    setEditedAttachmentName(attachments[index].name);
  };

  const handleSaveAttachment = () => {
    if (editingAttachmentIndex !== null) {
      const updatedAttachments = [...attachments];
      const newFile = new File([updatedAttachments[editingAttachmentIndex]], editedAttachmentName, {
        type: updatedAttachments[editingAttachmentIndex].type,
        lastModified: updatedAttachments[editingAttachmentIndex].lastModified,
      });
      updatedAttachments[editingAttachmentIndex] = newFile;
      setAttachments(updatedAttachments);
    }
    setEditingAttachmentIndex(null);
    setEditedAttachmentName("");
  };

  const handleCancelEditAttachment = () => {
    setEditingAttachmentIndex(null);
    setEditedAttachmentName("");
  };

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, employee: any) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedEmployeeForAction(employee);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedEmployeeForAction(null);
  };

  const handleEditEmployeeAction = () => {
    if (selectedEmployeeForAction && onEditEmployee) {
      onEditEmployee(selectedEmployeeForAction);
    }
    handleActionMenuClose();
  };

  const handleDeleteEmployeeAction = () => {
    if (selectedEmployeeForAction && onDeleteEmployee) {
      onDeleteEmployee(selectedEmployeeForAction.id);
    }
    handleActionMenuClose();
  };

  const cardBg = isDarkMode ? 'bg-[#251842]' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const secondaryTextColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-purple-800/30' : 'border-gray-200';
  const accentColor = '#8B5CF6';

  const renderInsuranceCard = (insurance: MedicalInsuranceRow) => (
    <Box
      key={insurance.id}
      component="fieldset"
      sx={{
        border: "1px solid rgba(255, 255, 255, 0.4)",
        borderRadius: "24px",
        px: 3,
        pb: 3,
        pt: 2,
        position: "relative",
        minWidth: 500,
        flex: "1 1 auto",
        maxWidth: "calc(50% - 8px)",
      }}
    >
      <Box
        component="legend"
        sx={{
          fontSize: "24px",
          fontWeight: 700,
          color: isDarkMode ? "#fff" : "#111827",
        }}
      >
        {insurance.name}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5, backgroundColor: "rgba(0, 0, 0, 0.10)", px: 2 }}>
          <Typography variant="body2" className={secondaryTextColor}>
            {t("serviceName") || "اسم الخدمة"}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "medium", color: textColor }}>
            {insurance.service_name || insurance.name}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5, backgroundColor: "rgba(0, 0, 0, 0.10)", px: 2 }}>
          <Typography variant="body2" className={secondaryTextColor}>
            {t("policyNumber") || "رقم البوليصة"}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "medium", color: textColor }}>
            {insurance.policy_number}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5, backgroundColor: "rgba(0, 0, 0, 0.10)", px: 2 }}>
          <Typography variant="body2" className={secondaryTextColor}>
            {t("serviceProvider") || "مزود الخدمة"}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "medium", color: textColor }}>
            {insurance.provider || insurance.provider_name || "-"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5, backgroundColor: "rgba(0, 0, 0, 0.10)", px: 2 }}>
          <Typography variant="body2" className={secondaryTextColor}>
            {t("startData") || "تاريخ البدء"}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "medium", color: textColor }}>
            {insurance.start_date || "-"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5, backgroundColor: "rgba(0, 0, 0, 0.10)", px: 2 }}>
          <Typography variant="body2" className={secondaryTextColor}>
            {t("endData") || "تاريخ الانتهاء"}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "medium", color: textColor }}>
            {insurance.end_date || "-"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5, backgroundColor: "rgba(0, 0, 0, 0.10)", px: 2 }}>
          <Typography variant="body2" className={secondaryTextColor}>
            {t("value") || "القيمة"}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "medium", color: textColor }}>
            {insurance.value ? `${insurance.value.toLocaleString()} ريال` : "-"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5, backgroundColor: "rgba(0, 0, 0, 0.10)", px: 2 }}>
          <Typography variant="body2" className={secondaryTextColor}>
            {t("numberOfIndividuals") || "عدد الأفراد"}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "medium", color: textColor }}>
            {insurance.individuals_count || insurance.number_of_individuals || "-"}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
        <Typography
          variant="body2"
          sx={{
            color: "primary.main",
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" }
          }}
          onClick={() => handleOpenDetailsDialog(insurance)}
        >
          {t("viewDetails") || "عرض التفاصيل"}
        </Typography>
        <Button
          variant="contained"
          size="small"
          color="primary"
        >
          {insurance.status === 1 ? (t("active") || "نشط") : (t("inactive") || "غير نشط")}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ flex: 1, pl: 2, overflow: "auto" }}>
      {selectedInsurance ? (
        <>
          {/* Tab Content */}
          {activeTab === 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {/* Policy Data */}
              <Box sx={{ mt: 2 }}>
                <Box
                  component="fieldset"
                  sx={{
                    border: `1px solid ${
                      isDarkMode
                        ? "rgba(255, 255, 255, 0.4)"
                        : "#d1d5db"
                    }`,
                    borderRadius: "24px",
                    px: 3,
                    pb: 3,
                    pt: 2,
                    position: "relative",
                  }}
                >
                  {/* Title */}
                  <Box
                    component="legend"
                    sx={{
                      width: "100%",
                      px: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    {/* العنوان */}
                    <Typography
                      sx={{
                        fontSize: "24px",
                        fontWeight: 700,
                        color: isDarkMode ? "#fff" : "#111827",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {selectedInsurance?.name}
                    </Typography>

                    {/* الخط الممتد */}
                    <Box
                      sx={{
                        flex: 1,
                        height: "1px",
                        background: isDarkMode
                          ? "rgba(255, 255, 255, 0.4)"
                          : "#d1d5db",
                      }}
                    />

                    {/* الايقونة */}
                    <IconButton size="small" onClick={handleEditPolicy} sx={{ color: "primary.main", p: 0.5, "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" } }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <>
                      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, py: 2 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                          <Typography variant="body2" className={secondaryTextColor}>
                            {t("serviceName")}
                          </Typography>
                          <TextField
                            size="small"
                            value={isEditingPolicy ? (editedPolicy?.service_name || editedPolicy?.name) : (selectedInsurance.service_name || selectedInsurance.name)}
                            onChange={(e) => handlePolicyChange("service_name", e.target.value)}
                            disabled={!isEditingPolicy}
                            sx={{
                              width: "100%",
                              "& .MuiInputBase-input": {
                                color: textColor,
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: isEditingPolicy ? "primary.main" : "transparent",
                              },
                              "& .Mui-disabled": {
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "transparent",
                                },
                              },
                            }}
                          />
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                          <Typography variant="body2" className={secondaryTextColor}>
                            {t("policyNumber")}
                          </Typography>
                          <TextField
                            size="small"
                            value={isEditingPolicy ? (editedPolicy?.policy_number || selectedInsurance.policy_number) : selectedInsurance.policy_number}
                            onChange={(e) => handlePolicyChange("policy_number", e.target.value)}
                            disabled={!isEditingPolicy}
                            sx={{
                              width: "100%",
                              "& .MuiInputBase-input": {
                                color: textColor,
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: isEditingPolicy ? "primary.main" : "transparent",
                              },
                              "& .Mui-disabled": {
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "transparent",
                                },
                              },
                            }}
                          />
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                          <Typography variant="body2" className={secondaryTextColor}>
                            {t("serviceProvider")}
                          </Typography>
                          <TextField
                            size="small"
                            value={isEditingPolicy ? (editedPolicy?.provider_name || editedPolicy?.provider || editedPolicy?.employee_name || editedPolicy?.employee?.name) : (selectedInsurance.provider_name || selectedInsurance.provider || selectedInsurance.employee_name || selectedInsurance.employee?.name || "-")}
                            onChange={(e) => handlePolicyChange("provider_name", e.target.value)}
                            disabled={!isEditingPolicy}
                            sx={{
                              width: "100%",
                              "& .MuiInputBase-input": {
                                color: textColor,
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: isEditingPolicy ? "primary.main" : "transparent",
                              },
                              "& .Mui-disabled": {
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "transparent",
                                },
                              },
                            }}
                          />
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                          <Typography variant="body2" className={secondaryTextColor}>
                            {t("startData")}
                          </Typography>
                          <TextField
                            size="small"
                            type="date"
                            value={isEditingPolicy ? editedPolicy?.start_date : selectedInsurance.start_date}
                            onChange={(e) => handlePolicyChange("start_date", e.target.value)}
                            disabled={!isEditingPolicy}
                            InputLabelProps={{ shrink: true }}
                            sx={{
                              width: "100%",
                              "& .MuiInputBase-input": {
                                color: textColor,
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: isEditingPolicy ? "primary.main" : "transparent",
                              },
                              "& .Mui-disabled": {
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "transparent",
                                },
                              },
                            }}
                          />
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                          <Typography variant="body2" className={secondaryTextColor}>
                            {t("endData")}
                          </Typography>
                          <TextField
                            size="small"
                            type="date"
                            value={isEditingPolicy ? editedPolicy?.end_date : selectedInsurance.end_date}
                            onChange={(e) => handlePolicyChange("end_date", e.target.value)}
                            disabled={!isEditingPolicy}
                            InputLabelProps={{ shrink: true }}
                            sx={{
                              width: "100%",
                              "& .MuiInputBase-input": {
                                color: textColor,
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: isEditingPolicy ? "primary.main" : "transparent",
                              },
                              "& .Mui-disabled": {
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "transparent",
                                },
                              },
                            }}
                          />
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                          <Typography variant="body2" className={secondaryTextColor}>
                            {t("value")}
                          </Typography>
                          <TextField
                            size="small"
                            type="number"
                            value={isEditingPolicy ? editedPolicy?.value : selectedInsurance.value}
                            onChange={(e) => handlePolicyChange("value", parseFloat(e.target.value))}
                            disabled={!isEditingPolicy}
                            sx={{
                              width: "100%",
                              "& .MuiInputBase-input": {
                                color: textColor,
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: isEditingPolicy ? "primary.main" : "transparent",
                              },
                              "& .Mui-disabled": {
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "transparent",
                                },
                              },
                            }}
                          />
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                          <Typography variant="body2" className={secondaryTextColor}>
                            {t("numberOfIndividuals")}
                          </Typography>
                          <TextField
                            size="small"
                            type="number"
                            value={isEditingPolicy ? (editedPolicy?.number_of_individuals || editedPolicy?.individuals_count) : (selectedInsurance.number_of_individuals || selectedInsurance.individuals_count)}
                            onChange={(e) => handlePolicyChange("number_of_individuals", parseInt(e.target.value))}
                            disabled={!isEditingPolicy}
                            sx={{
                              width: "100%",
                              "& .MuiInputBase-input": {
                                color: textColor,
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: isEditingPolicy ? "primary.main" : "transparent",
                              },
                              "& .Mui-disabled": {
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "transparent",
                                },
                              },
                            }}
                          />
                        </Box>
                      </Box>
                      {isEditingPolicy && (
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
                          <Button onClick={handleCancelEdit} variant="outlined" size="small" sx={{ borderColor: "#ef4444", color: "#ef4444" }}>
                            {t("cancel")}
                          </Button>
                          <Button onClick={handleSavePolicy} variant="contained" size="small" sx={{ backgroundColor: "primary.main", color: "white" }}>
                            {t("save")}
                          </Button>
                        </Box>
                      )}
                  </>
                </Box>
              </Box>

              {/* Attachments Section */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {/* Attachments Section */}
                <Box sx={{ mt: 4 }}>

                  <Box
                      component="fieldset"
                      sx={{
                        border: `1px solid ${
                            isDarkMode
                                ? "rgba(255, 255, 255, 0.4)"
                                : "#d1d5db"
                        }`,
                        borderRadius: "24px",
                        px: 3,
                        pb: 3,
                        pt: 2,
                        position: "relative",
                        minHeight: 220,
                      }}
                  >

                    {/* Title */}
                    <Box
                        component="legend"
                        sx={{
                          width: "100%",
                          px: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                    >
                      {/* العنوان */}
                      <Typography
                        sx={{
                          fontSize: "24px",
                          fontWeight: 700,
                          color: isDarkMode ? "#fff" : "#111827",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {t("attachments") || "المرفقات"}
                      </Typography>

                      {/* الخط الممتد */}
                      <Box
                        sx={{
                          flex: 1,
                          height: "1px",
                          background: isDarkMode
                            ? "rgba(255, 255, 255, 0.4)"
                            : "#d1d5db",
                        }}
                      />

                      {/* الايقونة */}
                      <IconButton size="small" onClick={() => {
                        if (editingAttachmentIndex !== null) {
                          handleCancelEditAttachment();
                        } else if (attachments.length > 0) {
                          handleEditAttachment(0);
                        }
                      }} sx={{ color: "primary.main", p: 0.5, "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" } }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    {/* Add Button and Attachments */}
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
                      <Button
                          onClick={handleUploadClick}
                          variant="outlined"
                          sx={{
                            borderColor: "primary.main",
                            color: "primary.main",
                            borderRadius: "12px",
                            width: "105px",
                            height: "100px",
                            px: 2,
                            py: 1,
                            textTransform: "none",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,

                            "&:hover": {
                              borderColor: "rgba(255, 255, 255, 0.4)",
                              backgroundColor: "rgba(255, 255, 255, 0.4)",
                            },
                          }}
                      >
                        <CloudUploadOutlinedIcon sx={{ fontSize: 32 }} />
                        <Typography variant="caption" sx={{ fontSize: "12px" }}>
                          {t("addAttachment") || "إضافة مرفق"}
                        </Typography>
                      </Button>

                      <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          style={{ display: "none" }}
                          multiple
                          accept="image/*,.pdf,.doc,.docx"
                      />
                      {attachments.map((file, index) => (
                          <Box
                              key={index}
                              sx={{
                                position: "relative",
                              }}
                          >
                            <Button
                                variant="outlined"
                                onClick={() => handleEditAttachment(index)}
                                sx={{
                                  borderColor: "primary.main",
                                  color: "primary.main",
                                  borderRadius: "12px",
                                  width: "105px",
                                  height: "100px",
                                  px: 2,
                                  py: 1,
                                  textTransform: "none",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 1,

                                  "&:hover": {
                                    borderColor: "rgba(255, 255, 255, 0.4)",
                                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                                  },
                                }}
                            >
                              <FileText size={32} />
                              {editingAttachmentIndex === index ? (
                                <input
                                  type="text"
                                  value={editedAttachmentName}
                                  onChange={(e) => setEditedAttachmentName(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    fontSize: "12px",
                                    textAlign: "center",
                                    width: "100%",
                                    border: "none",
                                    outline: "none",
                                    background: "transparent",
                                    color: "inherit",
                                  }}
                                />
                              ) : (
                                <Typography variant="caption" sx={{ fontSize: "12px", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>
                                  {file.name}
                                </Typography>
                              )}
                            </Button>

                            {/* Delete Button - فقط في حالة التعديل */}
                            {editingAttachmentIndex === index && (
                                <IconButton
                                    size="small"
                                    onClick={() => handleRemoveAttachment(index)}
                                    sx={{
                                      position: "absolute",
                                      top: -8,
                                      right: -8,
                                      backgroundColor: "#ef4444",
                                      color: "white",
                                      width: 24,
                                      height: 24,
                                      p: 0,
                                      "&:hover": {
                                        backgroundColor: "#dc2626",
                                      },
                                    }}
                                >
                                  <X size={14} />
                                </IconButton>
                            )}
                          </Box>
                      ))}
                    </Box>

                    {/* Global Edit Mode Buttons */}
                    {editingAttachmentIndex !== null && (
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
                          <Button
                              size="small"
                              onClick={handleSaveAttachment}
                              variant="contained"
                              sx={{
                                backgroundColor: "primary.main",
                                borderRadius: "8px",
                                textTransform: "none",
                              }}
                          >
                            حفظ
                          </Button>
                          <Button
                              size="small"
                              onClick={handleCancelEditAttachment}
                              variant="outlined"
                              sx={{
                                borderColor: "#ef4444",
                                color: "#ef4444",
                                borderRadius: "8px",
                                textTransform: "none",
                              }}
                          >
                            إلغاء
                          </Button>
                        </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {activeTab === 1 && (
            <Box
              component="fieldset"
              sx={{
                border: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.4)" : "#d1d5db"}`,
                borderRadius: "24px",
                px: 3,
                pb: 3,
                pt: 2,
                width: "100%",
              }}
            >
              <Box
                component="legend"
                sx={{
                  px: 2,
                  fontSize: "24px",
                  fontWeight: 700,
                  color: isDarkMode ? "#fff" : "#111827",
                }}
              >
                {selectedInsurance?.name || "تأمين بوبا"}
              </Box>

              {/* Table */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" sx={{ color: secondaryTextColor, fontWeight: 600, borderBottom: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.2)" : "#e5e7eb"}` }}>
                        {t("employeeName")}
                      </TableCell>
                      <TableCell align="center" sx={{ color: secondaryTextColor, fontWeight: 600, borderBottom: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.2)" : "#e5e7eb"}` }}>
                        {t("category")}
                      </TableCell>
                      <TableCell align="center" sx={{ color: secondaryTextColor, fontWeight: 600, borderBottom: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.2)" : "#e5e7eb"}` }}>
                        {t("dependents")}
                      </TableCell>
                      <TableCell align="center" sx={{ color: secondaryTextColor, fontWeight: 600, borderBottom: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.2)" : "#e5e7eb"}` }}>
                        {t("coveragePercentage")}
                      </TableCell>
                      <TableCell align="center" sx={{ color: secondaryTextColor, fontWeight: 600, borderBottom: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.2)" : "#e5e7eb"}` }}>
                        {t("status")}
                      </TableCell>
                      <TableCell align="center" sx={{ color: secondaryTextColor, fontWeight: 600, borderBottom: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.2)" : "#e5e7eb"}` }}>
                        {t("action")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employees.length > 0 ? (
                      employees.map((employee, index) => {
                        console.log(`🔍 Employee ${index + 1}:`, employee);
                        console.log(`🔍 Employee keys:`, Object.keys(employee));
                        console.log(`🔍 Category:`, employee.category);
                        console.log(`🔍 Dependents:`, employee.dependents);
                        return (
                        <TableRow 
                          key={employee.id}
                          sx={{
                            '&:last-child td': { borderBottom: 0 },
                            '& td': { 
                              borderBottom: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#f3f4f6"}`,
                              py: 2
                            }
                          }}
                        >
                          <TableCell align="center" sx={{ color: textColor, fontWeight: 500 }}>
                            {employee.user?.name || employee.employee_name || employee.user_name || (Array.isArray(employee.name) ? employee.name[0] : employee.name) || `ID: ${employee.employee_id?.substring(0, 8)}...`}
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: "medium", color: "#fbbf24" }}>
                              {employee.category?.name || employee.category_name || (employee.category_id ? `فئة ${employee.category_id}` : "-")}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: "medium", color: "#8b5cf6" }}>
                              {employee.dependents?.length ? `${employee.dependents.length} ${t("dependentsCount")}` : (employee.dependents_count ? `${employee.dependents_count} ${t("dependentsCount")}` : "-")}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: "medium", color: "#ec4899" }}>
                              {employee.amount ? `${employee.amount} ريال` : (employee.value ? `${employee.value} ريال` : "-")}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                backgroundColor: "transparent",
                                color: "#10b981",
                                borderRadius: "20px",
                                px: 2,
                                fontSize: "12px",
                                textTransform: "none",
                                minWidth: "60px",
                                boxShadow: "none",
                                "&:hover": {
                                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                                  boxShadow: "none",
                                }
                              }}
                            >
                              ● {t("active")}
                            </Button>
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              size="small"
                              onClick={(e) => handleActionMenuOpen(e, employee)}
                              sx={{
                                backgroundColor: "#64748b",
                                color: "#fff",
                                borderRadius: "8px",
                                px: 2,
                                fontSize: "12px",
                                textTransform: "none",
                                minWidth: "60px",
                                "&:hover": {
                                  backgroundColor: "#475569",
                                }
                              }}
                            >
                              {t("action")} ▼
                            </Button>
                            <Menu
                              anchorEl={actionMenuAnchor}
                              open={Boolean(actionMenuAnchor)}
                              onClose={handleActionMenuClose}
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                              }}
                              transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                              }}
                            >
                              <MenuItem onClick={handleEditEmployeeAction}>
                                <EditIcon fontSize="small" sx={{ mr: 1 }} />
                                تعديل
                              </MenuItem>
                              <MenuItem onClick={handleDeleteEmployeeAction} sx={{ color: "#ef4444" }}>
                                <X fontSize="small" sx={{ mr: 1 }} />
                                حذف
                              </MenuItem>
                            </Menu>
                          </TableCell>
                        </TableRow>
                      );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4, color: secondaryTextColor }}>
                          {t("noEmployees") || "لا يوجد موظفين"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {activeTab === 2 && (
            <Box
              component="fieldset"
              sx={{
                border: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.4)" : "#d1d5db"}`,
                borderRadius: "24px",
                px: 3,
                pb: 3,
                pt: 2,
                width: "100%",
              }}
            >
              <Box
                component="legend"
                sx={{
                  px: 2,
                  fontSize: "24px",
                  fontWeight: 700,
                  color: isDarkMode ? "#fff" : "#111827",
                }}
              >
                جميع الفئات
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {categories.length > 0 ? (
                  paginatedCategories.map((category, index) => (
                    <Box
                      key={index}
                      component="fieldset"
                      sx={{
                        border: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.4)" : "#d1d5db"}`,
                        borderRadius: "24px",
                        px: 3,
                        pb: 3,
                        pt: 2,
                        position: "relative",
                        width: "100%",
                      }}
                    >
                      {/* Legend with only Edit Icon - Left aligned */}
                      <Box
                        component="legend"
                        sx={{
                          px: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        <IconButton 
                          size="small" 
                          onClick={() => onEditCategory && onEditCategory(category)} 
                          sx={{ 
                            color: "primary.main",
                            p: 0.5,
                            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Category Name - Left aligned */}
                      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
                        <Typography
                          sx={{
                            fontSize: "18px",
                            fontWeight: 700,
                            color: isDarkMode ? "#fff" : "#111827",
                          }}
                        >
                          {category.name}
                        </Typography>
                      </Box>

                      {/* Description - Left aligned */}
                      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: secondaryTextColor,
                            lineHeight: 1.6,
                            textAlign: "left"
                          }}
                        >
                          {category.description || "تغطية شاملة داخل المملكة مع استثناء علاج خارجي"}
                        </Typography>
                      </Box>

                      {/* Category Type Badge - Left aligned */}
                      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
                        <Box
                          sx={{
                            border: "1px solid #a78bfa",
                            backgroundColor: "rgba(167, 139, 250, 0.15)",
                            color: "#a78bfa",
                            borderRadius: "20px",
                            px: 2.5,
                            py: 0.8,
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          {category.type || category.categoryType}
                        </Box>
                      </Box>

                      {/* Coverage Label and Limit on same line */}
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                          الحد الأقصى
                        </Typography>
                        <Typography sx={{ fontSize: "16px", fontWeight: 600, color: textColor }}>
                          للتغطية {category.coverage_limit || category.maxCoverage} ريال
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ py: 4, textAlign: "center" }}>
                    <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                      {t("noCategories")}
                    </Typography>
                  </Box>
                )}
              </Box>
              
              {/* Pagination Controls */}
              {totalCategoryPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mt: 3 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={categoryPage === 1}
                    onClick={() => setCategoryPage(prev => Math.max(1, prev - 1))}
                    sx={{ minWidth: "auto" }}
                  >
                    السابق
                  </Button>
                  
                  <Typography variant="body2" sx={{ color: textColor }}>
                    صفحة {categoryPage} من {totalCategoryPages}
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={categoryPage === totalCategoryPages}
                    onClick={() => setCategoryPage(prev => Math.min(totalCategoryPages, prev + 1))}
                    sx={{ minWidth: "auto" }}
                  >
                    التالي
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </>
      ) : (
        <>
         
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {displayInsurances.map(renderInsuranceCard)}
          </Box>
        </>
      )}

      {/* Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: isDarkMode ? '#251842' : 'white',
            color: textColor,
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {detailsInsurance?.name}
          </Typography>
          <IconButton onClick={handleCloseDetailsDialog}>
            <X />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {detailsInsurance && (
            <Box
              component="fieldset"
              sx={{
                border: "1px solid rgba(255, 255, 255, 0.4)",
                borderRadius: "24px",
                px: 3,
                pb: 3,
                pt: 2,
                position: "relative",
              }}
            >
              <Box
                component="legend"
                sx={{
                  px: 2,
                  fontSize: "24px",
                  fontWeight: 700,
                  color: isDarkMode ? "#fff" : "#111827",
                }}
              >
                {t("insuranceDetails") || "تفاصيل التأمين"}
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5 }}>
                  <Typography variant="body2" className={secondaryTextColor}>
                    {t("serviceName") || "اسم الخدمة"}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: textColor }}>
                    {detailsInsurance.service_name || detailsInsurance.name}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5 }}>
                  <Typography variant="body2" className={secondaryTextColor}>
                    {t("policyNumber") || "رقم البوليصة"}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: textColor }}>
                    {detailsInsurance.policy_number}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5 }}>
                  <Typography variant="body2" className={secondaryTextColor}>
                    {t("serviceProvider") || "مزود الخدمة"}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: textColor }}>
                    {detailsInsurance.provider_name || detailsInsurance.employee_name || detailsInsurance.employee?.name || "-"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5 }}>
                  <Typography variant="body2" className={secondaryTextColor}>
                    {t("startData") || "تاريخ البدء"}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: textColor }}>
                    {detailsInsurance.start_date || "-"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5 }}>
                  <Typography variant="body2" className={secondaryTextColor}>
                    {t("endData") || "تاريخ الانتهاء"}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: textColor }}>
                    {detailsInsurance.end_date || "-"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5 }}>
                  <Typography variant="body2" className={secondaryTextColor}>
                    {t("value") || "القيمة"}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: textColor }}>
                    {detailsInsurance.value ? `${detailsInsurance.value.toLocaleString()} ريال` : "-"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5 }}>
                  <Typography variant="body2" className={secondaryTextColor}>
                    {t("numberOfIndividuals") || "عدد الأفراد"}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: textColor }}>
                    {detailsInsurance.number_of_individuals ? `${detailsInsurance.number_of_individuals} فرد` : "-"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
