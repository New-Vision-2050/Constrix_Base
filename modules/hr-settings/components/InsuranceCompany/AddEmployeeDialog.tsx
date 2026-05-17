"use client";
import {
  Dialog,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem as MuiMenuItem,
  Autocomplete,
  Chip,
} from "@mui/material";
import { MoreVertical } from "lucide-react";
import { X, Pencil } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import PremiumStepper from "./components/PremiumStepper";

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (employee: any) => void;
  editingEmployee?: any;
}

export default function AddEmployeeDialog({
  open,
  onOpenChange,
  onSuccess,
  editingEmployee,
}: AddEmployeeDialogProps) {
  const t = useTranslations("hr-settings.insurance");
  const [currentStep, setCurrentStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dependentsDialogOpen, setDependentsDialogOpen] = useState(false);
  const [dependentFormDialogOpen, setDependentFormDialogOpen] = useState(false);
  const [dependents, setDependents] = useState<any[]>([]);
  const [editingDependent, setEditingDependent] = useState<any>(null);
  const [dependentFormData, setDependentFormData] = useState({
    name: "",
    residenceNumber: "",
    relationship: "",
    subscriberNumber: "",
    value: "",
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDependent, setSelectedDependent] = useState<any>(null);

  const STEPS = useMemo(() => [
    { number: 1, label: "اختيار الموظف" },
    { number: 2, label: "اختيار البوليصة" },
    { number: 3, label: "بيانات المشترك" },
    { number: 4, label: "العائلون" },
    { number: 5, label: "المراجعة والحفظ" },
  ], []);

  const [formData, setFormData] = useState({
    name: [] as string[],
    employeeId: "",
    policyId: "",
    value: "",
    oldPolicyId: "",
    oldValue: "",
    department: "",
    position: "",
    subscriberName: "",
    subscriberId: "",
    oldSubscriberId: "",
    relationship: "",
  });

  // Reset form when dialog opens/closes or editing employee changes
  useEffect(() => {
    if (open) {
      setCurrentStep(0);
      if (editingEmployee) {
        setIsEditMode(true);
        setFormData({
          name: editingEmployee.name ? (Array.isArray(editingEmployee.name) ? editingEmployee.name : [editingEmployee.name]) : [],
          employeeId: editingEmployee.employeeId || "",
          policyId: editingEmployee.policyId || "",
          value: editingEmployee.value || "",
          oldPolicyId: editingEmployee.oldPolicyId || editingEmployee.policyId || "",
          oldValue: editingEmployee.oldValue || editingEmployee.value || "",
          department: editingEmployee.department || "",
          position: editingEmployee.position || "",
          subscriberName: editingEmployee.subscriberName || "",
          subscriberId: editingEmployee.subscriberId || "",
          oldSubscriberId: editingEmployee.oldSubscriberId || editingEmployee.subscriberId || "",
          relationship: editingEmployee.relationship || "",
        });
      } else {
        setIsEditMode(false);
        setFormData({
          name: [],
          employeeId: "",
          policyId: "",
          value: "",
          oldPolicyId: "",
          oldValue: "",
          department: "",
          position: "",
          subscriberName: "",
          subscriberId: "",
          oldSubscriberId: "",
          relationship: "",
        });
      }
    }
  }, [open, editingEmployee]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || formData.name.length === 0) {
      toast.error("يرجى اختيار الموظفين");
      return;
    }

    const employeeData = editingEmployee
      ? { ...formData, id: editingEmployee.id }
      : formData;

    console.log("Saving employee:", employeeData);

    try {
      // سيتم استدعاء API من المكون الأب (index.tsx)
      toast.success(editingEmployee ? "تم تعديل الموظف بنجاح" : "تم إضافة الموظف بنجاح");
      onOpenChange(false);
      onSuccess(employeeData);
    } catch (error) {
      console.error("Error saving employee:", error);
      toast.error("حدث خطأ أثناء حفظ الموظف");
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDependentInputChange = (field: keyof typeof dependentFormData, value: string) => {
    setDependentFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddDependent = () => {
    if (!dependentFormData.name || !dependentFormData.residenceNumber) {
      toast.error("يرجى إدخال الاسم ورقم الإقامة");
      return;
    }

    if (editingDependent) {
      setDependents(prev =>
        prev.map(dep => (dep.id === editingDependent.id ? { ...dependentFormData, id: editingDependent.id } : dep))
      );
      toast.success("تم تعديل بيانات العالون بنجاح");
    } else {
      setDependents(prev => [...prev, { ...dependentFormData, id: Date.now() }]);
      toast.success("تم إضافة العالون بنجاح");
    }

    setDependentFormData({
      name: "",
      residenceNumber: "",
      relationship: "",
      subscriberNumber: "",
      value: "",
    });
    setEditingDependent(null);
  };

  const handleEditDependent = (dependent: any) => {
    setEditingDependent(dependent);
    setDependentFormData({
      name: dependent.name,
      residenceNumber: dependent.residenceNumber,
      relationship: dependent.relationship,
      subscriberNumber: dependent.subscriberNumber,
      value: dependent.value,
    });
    setDependentFormDialogOpen(true);
  };

  const handleOpenAddDependentForm = () => {
    setEditingDependent(null);
    setDependentFormData({
      name: "",
      residenceNumber: "",
      relationship: "",
      subscriberNumber: "",
      value: "",
    });
    setDependentFormDialogOpen(true);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, dependent: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedDependent(dependent);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDependent(null);
  };

  const handleMenuEdit = () => {
    if (selectedDependent) {
      handleEditDependent(selectedDependent);
    }
    handleMenuClose();
  };

  const handleMenuDelete = () => {
    if (selectedDependent) {
      handleDeleteDependent(selectedDependent.id);
    }
    handleMenuClose();
  };

  const handleDeleteDependent = (id: number) => {
    setDependents(prev => prev.filter(dep => dep.id !== id));
    toast.success("تم حذف العالون بنجاح");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Pill/Capsule Button Container */}
            <Box
              sx={{
                display: "flex",
                background: "rgba(88, 28, 135, 0.6)",
                borderRadius: 50,
                p: 0.5,
                gap: 0.5,
                width: "fit-content",
                direction: "rtl",
              }}
            >
              <Button
                onClick={() => setIsEditMode(true)}
                variant={isEditMode ? "contained" : "outlined"}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 50,
                  fontSize: 14,
                  fontWeight: 600,
                  background: isEditMode
                    ? "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)"
                    : "transparent",
                  color: isEditMode ? "white" : "rgba(255, 255, 255, 0.7)",
                  border: isEditMode ? "none" : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  "&:hover": {
                    background: isEditMode
                      ? "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)"
                      : "rgba(88, 28, 135, 0.8)",
                  },
                }}
              >
                <Pencil size={16} />
                تعديل
              </Button>
              <Button
                onClick={() => setIsEditMode(false)}
                variant={isEditMode ? "outlined" : "contained"}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 50,
                  fontSize: 14,
                  fontWeight: 600,
                  background: isEditMode
                    ? "transparent"
                    : "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
                  color: isEditMode ? "rgba(255, 255, 255, 0.7)" : "white",
                  border: isEditMode ? "none" : "none",
                  "&:hover": {
                    background: isEditMode
                      ? "rgba(88, 28, 135, 0.8)"
                      : "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
                  },
                }}
              >
                إضافة جديد
              </Button>
            </Box>

            {isEditMode ? (
              // Edit mode: single employee search
              <Autocomplete
                options={["موظف 1", "موظف 2", "موظف 3", "موظف 4", "موظف 5"]}
                value={formData.name[0] || null}
                onChange={(event, newValue) => handleInputChange("name", newValue ? [newValue] : [])}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="الاسم"
                    placeholder="ابحث عن موظف"
                    size="large"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 56,
                      },
                    }}
                  />
                )}
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                  "& .MuiAutocomplete-popupIndicator": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                  "& .MuiAutocomplete-clearIndicator": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                }}
              />
            ) : (
              // Add mode: multiple employees
              <Autocomplete
                multiple
                options={["موظف 1", "موظف 2", "موظف 3", "موظف 4", "موظف 5"]}
                value={formData.name}
                onChange={(event, newValue) => handleInputChange("name", newValue)}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return (
                      <Chip
                        key={key}
                        variant="outlined"
                        label={option}
                        {...tagProps}
                        sx={{
                          background: "rgba(139, 92, 246, 0.2)",
                          color: "white",
                          borderColor: "rgba(139, 92, 246, 0.5)",
                          "& .MuiChip-deleteIcon": {
                            color: "white",
                            "&:hover": {
                              color: "rgba(239, 68, 68, 1)",
                            },
                          },
                        }}
                      />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="الاسم"
                    placeholder="اختر الموظفين"
                    size="large"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 56,
                      },
                    }}
                  />
                )}
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                  "& .MuiAutocomplete-popupIndicator": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                  "& .MuiAutocomplete-clearIndicator": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                }}
              />
            )}
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: isEditMode ? "1fr 1fr 1fr 1fr" : "1fr 1fr 1fr" }, gap: 3 }}>
              <FormControl fullWidth size="large">
                <InputLabel>الاسم</InputLabel>
                <Select
                  value={formData.name.join(", ")}
                  label="الاسم"
                  disabled
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                    },
                  }}
                >
                  <MenuItem value="">اختر الموظف</MenuItem>
                  <MenuItem value="موظف 1">موظف 1</MenuItem>
                  <MenuItem value="موظف 2">موظف 2</MenuItem>
                  <MenuItem value="موظف 3">موظف 3</MenuItem>
                </Select>
              </FormControl>
              {isEditMode && (
                <>
                  <FormControl fullWidth size="large">
                    <InputLabel>البوليصة القديمة</InputLabel>
                    <Select
                      value={formData.oldPolicyId}
                      label="البوليصة القديمة"
                      disabled
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: 56,
                        },
                      }}
                    >
                      <MenuItem value="">البوليصة الحالية</MenuItem>
                      <MenuItem value="بوليصة 1">بوليصة 1</MenuItem>
                      <MenuItem value="بوليصة 2">بوليصة 2</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="large">
                    <InputLabel>القيمة القديمة</InputLabel>
                    <Select
                      value={formData.oldValue}
                      label="القيمة القديمة"
                      disabled
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: 56,
                        },
                      }}
                    >
                      <MenuItem value="">القيمة الحالية</MenuItem>
                      <MenuItem value="1000">1000</MenuItem>
                      <MenuItem value="2000">2000</MenuItem>
                    </Select>
                  </FormControl>
                </>
              )}
              <FormControl fullWidth size="large">
                <InputLabel>بوليصة جديدة</InputLabel>
                <Select
                  value={formData.policyId}
                  label="بوليصة جديدة"
                  onChange={(e) => handleInputChange("policyId", e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                    },
                  }}
                >
                  <MenuItem value="">اختر البوليصة</MenuItem>
                  <MenuItem value="بوليصة 1">بوليصة 1</MenuItem>
                  <MenuItem value="بوليصة 2">بوليصة 2</MenuItem>
                  <MenuItem value="بوليصة 3">بوليصة 3</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="large">
                <InputLabel>القيمة الجديدة</InputLabel>
                <Select
                  value={formData.value}
                  label="القيمة الجديدة"
                  onChange={(e) => handleInputChange("value", e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                    },
                  }}
                >
                  <MenuItem value="">اختر القيمة</MenuItem>
                  <MenuItem value="1000">1000</MenuItem>
                  <MenuItem value="2000">2000</MenuItem>
                  <MenuItem value="3000">3000</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: isEditMode ? "1fr 1fr 1fr 1fr" : "1fr 1fr 1fr" }, gap: 3 }}>
              <FormControl fullWidth size="large">
                <InputLabel>الاسم</InputLabel>
                <Select
                  value={formData.name.join(", ")}
                  label="الاسم"
                  disabled
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                    },
                  }}
                >
                  <MenuItem value="">اختر الموظف</MenuItem>
                  <MenuItem value="موظف 1">موظف 1</MenuItem>
                  <MenuItem value="موظف 2">موظف 2</MenuItem>
                  <MenuItem value="موظف 3">موظف 3</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="large">
                <InputLabel>القيمة</InputLabel>
                <Select
                  value={formData.value}
                  label="القيمة"
                  disabled
                  onChange={(e) => handleInputChange("value", e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                    },
                  }}
                >
                  <MenuItem value="">اختر القيمة</MenuItem>
                  <MenuItem value="1000">1000</MenuItem>
                  <MenuItem value="2000">2000</MenuItem>
                  <MenuItem value="3000">3000</MenuItem>
                </Select>
              </FormControl>
              {isEditMode && (
                <FormControl fullWidth size="large">
                  <InputLabel>رقم المشترك القديم</InputLabel>
                  <Select
                    value={formData.oldSubscriberId}
                    label="رقم المشترك القديم"
                    disabled
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 56,
                      },
                    }}
                  >
                    <MenuItem value="">الرقم الحالي</MenuItem>
                    <MenuItem value="12345">12345</MenuItem>
                    <MenuItem value="67890">67890</MenuItem>
                  </Select>
                </FormControl>
              )}
              <FormControl fullWidth size="large">
                <InputLabel>رقم المشترك {isEditMode ? "الجديد" : ""}</InputLabel>
                <Select
                  value={formData.subscriberId}
                  label={isEditMode ? "رقم المشترك الجديد" : "رقم المشترك"}
                  onChange={(e) => handleInputChange("subscriberId", e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                    },
                  }}
                >
                  <MenuItem value="">اختر رقم المشترك</MenuItem>
                  <MenuItem value="12345">12345</MenuItem>
                  <MenuItem value="67890">67890</MenuItem>
                  <MenuItem value="11223">11223</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 3 }}>
              <FormControl fullWidth size="large">
                <InputLabel>الاسم</InputLabel>
                <Select
                  value={formData.name.join(", ")}
                  label="الاسم"
                  disabled
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                    },
                  }}
                >
                  <MenuItem value="">اختر الموظف</MenuItem>
                  <MenuItem value="موظف 1">موظف 1</MenuItem>
                  <MenuItem value="موظف 2">موظف 2</MenuItem>
                  <MenuItem value="موظف 3">موظف 3</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="large">
                <InputLabel>القيمة</InputLabel>
                <Select
                  value={formData.value}
                  label="القيمة"
                  disabled
                  onChange={(e) => handleInputChange("value", e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                    },
                  }}
                >
                  <MenuItem value="">اختر القيمة</MenuItem>
                  <MenuItem value="1000">1000</MenuItem>
                  <MenuItem value="2000">2000</MenuItem>
                  <MenuItem value="3000">3000</MenuItem>
                </Select>
              </FormControl>
              <Button
                onClick={() => setDependentsDialogOpen(true)}
                variant="contained"
                size="large"
                sx={{
                  height: 56,
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 2,
                  background: "rgb(27,39,74)",
                }}
              >
                العالون
              </Button>
            </Box>
          </Box>
        );

      case 4:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr 1fr" }, gap: 3 }}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  fullWidth
                  label="الاسم"
                  value={formData.name.join(", ")}
                  disabled
                  size="large"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                    },
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                >
                  <Pencil size={20} color="rgba(148, 163, 184, 0.7)" />
                </Box>
              </Box>
              <Box sx={{ position: "relative" }}>
                <TextField
                  fullWidth
                  label="رقم المشترك"
                  value={formData.subscriberId}
                  onChange={(e) => handleInputChange("subscriberId", e.target.value)}
                  size="large"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                    },
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                >
                  <Pencil size={20} color="rgba(148, 163, 184, 0.7)" />
                </Box>
              </Box>
              <Box sx={{ position: "relative" }}>
                <TextField
                  fullWidth
                  label="رقم البوليصة"
                  value={formData.policyId}
                  onChange={(e) => handleInputChange("policyId", e.target.value)}
                  size="large"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                    },
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                >
                  <Pencil size={20} color="rgba(148, 163, 184, 0.7)" />
                </Box>
              </Box>
              <Box sx={{ position: "relative" }}>
                <TextField
                  fullWidth
                  label="القيمة"
                  value={formData.value}
                  onChange={(e) => handleInputChange("value", e.target.value)}
                  size="large"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                    },
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                >
                  <Pencil size={20} color="rgba(148, 163, 184, 0.7)" />
                </Box>
              </Box>
            </Box>

            {/* Dependents Data Section */}
            <Box
              sx={{
                p: 4,
              }}
            >
              <Typography sx={{ color: "rgb(255,255,255)", fontSize: 25, fontWeight: 800, mb: 4 }}>
                بيانات العائلون المحددة
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr 1fr 1fr" }, gap: 3 }}>
                <Box sx={{ position: "relative" }}>
                  <TextField
                    fullWidth
                    label="الاسم"
                    value={formData.name.join(", ")}
                    disabled
                    size="large"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 56,
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  >
                    <Pencil size={20} color="rgba(148, 163, 184, 0.7)" />
                  </Box>
                </Box>
                <Box sx={{ position: "relative" }}>
                  <TextField
                    fullWidth
                    label="رقم الإقامة"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange("employeeId", e.target.value)}
                    size="large"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 56,
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  >
                    <Pencil size={20} color="rgba(148, 163, 184, 0.7)" />
                  </Box>
                </Box>
                <Box sx={{ position: "relative" }}>
                  <TextField
                    fullWidth
                    label="العلاقة"
                    value={formData.relationship}
                    onChange={(e) => handleInputChange("relationship", e.target.value)}
                    size="large"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 56,
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  >
                    <Pencil size={20} color="rgba(148, 163, 184, 0.7)" />
                  </Box>
                </Box>
                <Box sx={{ position: "relative" }}>
                  <TextField
                    fullWidth
                    label="رقم المشترك"
                    value={formData.subscriberId}
                    onChange={(e) => handleInputChange("subscriberId", e.target.value)}
                    size="large"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 56,
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  >
                    <Pencil size={20} color="rgba(148, 163, 184, 0.7)" />
                  </Box>
                </Box>
                <Box sx={{ position: "relative" }}>
                  <TextField
                    fullWidth
                    label="القيمة"
                    value={formData.value}
                    onChange={(e) => handleInputChange("value", e.target.value)}
                    size="large"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 56,
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  >
                    <Pencil size={20} color="rgba(148, 163, 184, 0.7)" />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => onOpenChange(false)}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: { xs: "75vw", sm: "70vw", md: "60vw", lg: "50vw" },
            height: { xs: "90vh", md: "85vh" },
            maxHeight: "95vh",
            borderRadius: 3,
            p: { xs: 3, md: 6 },
          },
        }}
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            mx: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5" fontWeight="bold" fontSize={24}>
              {editingEmployee ? "تعديل موظف" : "إضافة موظف"}
            </Typography>
            <IconButton onClick={() => onOpenChange(false)} sx={{ minWidth: "auto", p: 1 }}>
              <X size={24} />
            </IconButton>
          </Box>

          <PremiumStepper steps={STEPS} currentStep={currentStep} />

          <Box
            sx={{
              flex: 1,
              mt: 6,
              overflowY: "auto",
            }}
          >
            {renderStepContent()}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: currentStep === 0 ? "flex-end" : "space-between",
              pt: 6,
              gap: 3,
            }}
          >
            {currentStep > 0 && (
              <Button
                onClick={handleBack}
                variant="outlined"
                size="large"
                sx={{
                  py: 2,
                  fontSize: 16,
                  px: 6,
                  borderRadius: 2,
                }}
              >
                رجوع
              </Button>
            )}

            <Button
              onClick={currentStep === STEPS.length - 1 ? handleSubmit : handleNext}
              variant="contained"
              size="large"
              sx={{
                py: 2,
                fontSize: 16,
                px: 6,
                borderRadius: 2,
              }}
            >
              {currentStep === STEPS.length - 1 ? "الحفظ و التأكيد" : "التالي"}
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Dependents Dialog */}
      <Dialog
        open={dependentsDialogOpen}
        onClose={() => setDependentsDialogOpen(false)}
        maxWidth="lg"
        PaperProps={{
          sx: {
            width: { xs: "90vw", md: "80vw" },
            maxHeight: "90vh",
            borderRadius: 3,
            p: 4,
          },
        }}
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5" fontWeight="bold" fontSize={24}>
              بيانات العائلون
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                onClick={handleOpenAddDependentForm}
                variant="contained"
                size="small"
                sx={{ fontSize: 14 }}
              >
                إضافة
              </Button>
              <IconButton onClick={() => setDependentsDialogOpen(false)} sx={{ minWidth: "auto", p: 1 }}>
                <X size={24} />
              </IconButton>
            </Box>
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: "rgba(30, 41, 59, 0.5)" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>الاسم</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>رقم الإقامة</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>العلاقة</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>رقم المشترك</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>القيمة</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>إجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dependents.map((dependent) => (
                  <TableRow
                    key={dependent.id}
                    sx={{
                      borderBottom: "1px solid rgba(139, 92, 246, 0.3)",
                      "&:hover": {
                        background: "rgba(30, 41, 59, 0.3)",
                      },
                    }}
                  >
                    <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>{dependent.name}</TableCell>
                    <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>{dependent.residenceNumber}</TableCell>
                    <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>{dependent.relationship}</TableCell>
                    <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>{dependent.subscriberNumber}</TableCell>
                    <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>{dependent.value}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, dependent)}
                        sx={{ minWidth: "auto", p: 0.5 }}
                      >
                        <MoreVertical size={16} />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                      >
                        <MuiMenuItem onClick={handleMenuEdit}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Pencil size={14} />
                            تعديل
                          </Box>
                        </MuiMenuItem>
                        <MuiMenuItem onClick={handleMenuDelete} sx={{ color: "red" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <X size={14} />
                            حذف
                          </Box>
                        </MuiMenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
                {dependents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
                      <Typography color="rgba(148, 163, 184, 0.7)">لا يوجد عائلون مضافين</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Dialog>

      {/* Dependent Form Dialog */}
      <Dialog
        open={dependentFormDialogOpen}
        onClose={() => setDependentFormDialogOpen(false)}
        maxWidth="md"
        PaperProps={{
          sx: {
            width: { xs: "90vw", md: "60vw" },
            borderRadius: 3,
            p: 4,
          },
        }}
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5" fontWeight="bold" fontSize={24}>
              {editingDependent ? "تعديل بيانات العالون" : "إضافة عالون"}
            </Typography>
            <IconButton onClick={() => setDependentFormDialogOpen(false)} sx={{ minWidth: "auto", p: 1 }}>
              <X size={24} />
            </IconButton>
          </Box>

          {/* Form */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
            <TextField
              fullWidth
              label="الاسم"
              value={dependentFormData.name}
              onChange={(e) => handleDependentInputChange("name", e.target.value)}
              size="large"
            />
            <TextField
              fullWidth
              label="رقم الإقامة"
              value={dependentFormData.residenceNumber}
              onChange={(e) => handleDependentInputChange("residenceNumber", e.target.value)}
              size="large"
            />
            <TextField
              fullWidth
              label="العلاقة"
              value={dependentFormData.relationship}
              onChange={(e) => handleDependentInputChange("relationship", e.target.value)}
              size="large"
            />
            <TextField
              fullWidth
              label="رقم المشترك"
              value={dependentFormData.subscriberNumber}
              onChange={(e) => handleDependentInputChange("subscriberNumber", e.target.value)}
              size="large"
            />
            <TextField
              fullWidth
              label="القيمة"
              value={dependentFormData.value}
              onChange={(e) => handleDependentInputChange("value", e.target.value)}
              size="large"
              sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              onClick={() => setDependentFormDialogOpen(false)}
              variant="outlined"
              size="large"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleAddDependent}
              variant="contained"
              size="large"
            >
              {editingDependent ? "تعديل" : "إضافة"}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
