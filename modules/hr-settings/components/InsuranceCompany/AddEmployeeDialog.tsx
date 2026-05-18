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
import { AllProjectsApi } from "@/services/api/projects/all-projects";
import { MedicalInsuranceApi, CreateSubscriptionParams, UpdateSubscriptionParams } from "@/services/api/medical-insurance";

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editingEmployee?: any;
  selectedInsuranceId?: string;
}

export default function AddEmployeeDialog({
  open,
  onOpenChange,
  onSuccess,
  editingEmployee,
  selectedInsuranceId,
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
  const [employees, setEmployees] = useState<any[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState("");
  const [insurances, setInsurances] = useState<any[]>([]);
  const [loadingInsurances, setLoadingInsurances] = useState(false);

  const STEPS = useMemo(() => [
    { number: 1, label: "اختيار الموظف" },
    { number: 2, label: "اختيار البوليصة" },
    { number: 3, label: "بيانات المشترك" },
    { number: 4, label: "العائلون" },
    { number: 5, label: "المراجعة والحفظ" },
  ], []);

  const [formData, setFormData] = useState({
    name: [] as string[],
    employeeId: "", // subscription_id
    employee_id: "", // actual employee_id (user_id)
    policyId: "",
    value: "",
    categoryId: "",
    oldPolicyId: "",
    oldValue: "",
    department: "",
    position: "",
    subscriberName: "",
    subscriberId: "",
    oldSubscriberId: "",
    relationship: "",
  });

  const [selectedEmployees, setSelectedEmployees] = useState<any[]>([]);

  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!open) return;
      
      setLoadingEmployees(true);
      try {
        // Fetch subscriptions (employees with insurance) instead of company users
        const response = await MedicalInsuranceApi.subscriptions.list({
          page: 1,
          per_page: 100,
        });
        
        // Handle different response structures
        let employeesList = [];
        if (response?.data?.payload) {
          employeesList = response.data.payload;
        } else if (Array.isArray(response?.data?.data)) {
          employeesList = response.data.data;
        } else if (Array.isArray(response?.data)) {
          employeesList = response.data;
        }
        
        console.log("👥 Loaded subscriptions:", employeesList.length, "employees");
        if (employeesList.length > 0) {
          console.log("👤 First subscription structure:", employeesList[0]);
        }
        setEmployees(employeesList);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error(t("saveError") || "حدث خطأ أثناء تحميل الموظفين");
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, [open, employeeSearchQuery]);

  // Fetch insurances from API
  useEffect(() => {
    const fetchInsurances = async () => {
      if (!open) return;
      
      setLoadingInsurances(true);
      try {
        const response = await MedicalInsuranceApi.list({
          per_page: 100,
        });
        
        if (response?.data?.payload) {
          setInsurances(response.data.payload);
          console.log("📋 Loaded insurances:", response.data.payload.length, "insurances");
        }
      } catch (error) {
        console.error("Error fetching insurances:", error);
        toast.error(t("saveError") || "حدث خطأ أثناء تحميل التأمينات");
      } finally {
        setLoadingInsurances(false);
      }
    };

    fetchInsurances();
  }, [open]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      if (!open) return;
      
      setLoadingCategories(true);
      try {
        const response = await MedicalInsuranceApi.categories.list({
          per_page: 100,
        });
        
        if (response?.data?.payload) {
          setCategories(response.data.payload);
          console.log("📋 Loaded categories:", response.data.payload.length, "categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error(t("saveError") || "حدث خطأ أثناء تحميل الفئات");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [open]);

  // Reset form when dialog opens/closes or editing employee changes
  useEffect(() => {
    if (open) {
      setCurrentStep(0);
      if (editingEmployee) {
        setIsEditMode(true);
        setFormData({
          name: editingEmployee.name ? (Array.isArray(editingEmployee.name) ? editingEmployee.name : [editingEmployee.name]) : [],
          employeeId: editingEmployee.id || "",
          employee_id: editingEmployee.employee_id || "",
          policyId: editingEmployee.policy_id || editingEmployee.medical_insurance_id || "",
          value: editingEmployee.amount?.toString() || editingEmployee.value || "",
          categoryId: editingEmployee.category_id || "",
          oldPolicyId: editingEmployee.oldPolicyId || editingEmployee.policyId || "",
          oldValue: editingEmployee.oldValue || editingEmployee.value || "",
          department: editingEmployee.department || "",
          position: editingEmployee.position || "",
          subscriberName: editingEmployee.subscriberName || "",
          subscriberId: editingEmployee.subscription_no || "",
          oldSubscriberId: editingEmployee.oldSubscriberId || editingEmployee.subscriberId || "",
          relationship: editingEmployee.relationship || "",
        });
        
        // Fetch dependents from API
        fetchDependents(editingEmployee.id);
      } else {
        setIsEditMode(false);
        setFormData({
          name: [],
          employeeId: "",
          employee_id: "",
          policyId: "",
          value: "",
          categoryId: "",
          oldPolicyId: "",
          oldValue: "",
          department: "",
          position: "",
          subscriberName: "",
          subscriberId: "",
          oldSubscriberId: "",
          relationship: "",
        });
        setSelectedEmployees([]);
        setDependents([]);
      }
    }
  }, [open, editingEmployee]);

  // Fetch dependents from API
  const fetchDependents = async (subscriptionId: string) => {
    try {
      const response = await MedicalInsuranceApi.dependents.list(subscriptionId, {
        page: 1,
        per_page: 100,
      });
      console.log("📋 Fetched dependents:", response.data.payload);
      
      // Map API response to local format
      const mappedDependents = response.data.payload.map((dep: any) => ({
        id: dep.id,
        name: dep.name,
        residenceNumber: dep.residence_number,
        relationship: dep.relationship,
        subscriberNumber: dep.subscriber_number,
        value: dep.value,
      }));
      
      setDependents(mappedDependents);
    } catch (error) {
      console.error("Error fetching dependents:", error);
      // If 404 or error, set empty array
      setDependents([]);
    }
  };

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
      toast.error(t("selectEmployee") || "يرجى اختيار الموظفين");
      return;
    }

    if (!formData.employeeId) {
      toast.error(t("selectEmployee") || "يرجى اختيار موظف");
      return;
    }

    if (!formData.policyId) {
      toast.error(t("selectInsurance") || "يرجى اختيار بوليصة");
      return;
    }

    if (!formData.subscriberId) {
      toast.error(t("enterSubscriptionNumber") || "يرجى إدخال رقم المشترك");
      return;
    }

    if (!formData.value) {
      toast.error(t("enterValue") || "يرجى إدخال القيمة");
      return;
    }

    try {
      if (editingEmployee) {
        // Update subscription
        const updateParams: UpdateSubscriptionParams = {
          user_id: formData.employee_id, // actual employee_id
          medical_insurance_id: formData.policyId,
          amount: parseFloat(formData.value),
          subscription_no: formData.subscriberId,
          category_id: formData.categoryId,
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
          status: 1, // 1 for update
          dependents: dependents.map(dep => ({
            name: dep.name,
            residence_number: dep.residenceNumber,
            relationship: dep.relationship,
            subscriber_number: dep.subscriberNumber,
            value: dep.value,
          })),
        };
        
        await MedicalInsuranceApi.subscriptions.update(editingEmployee.id, updateParams);
        toast.success(t("employeeUpdatedSuccessfully"));
      } else {
        // Create subscription
        const createParams: CreateSubscriptionParams = {
          user_id: formData.employee_id, // actual employee_id
          medical_insurance_id: formData.policyId,
          amount: parseFloat(formData.value),
          subscription_no: formData.subscriberId,
          category_id: formData.categoryId,
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
          status: 0, // 0 for create
          dependents: dependents.map(dep => ({
            name: dep.name,
            residence_number: dep.residenceNumber,
            relationship: dep.relationship,
            subscriber_number: dep.subscriberNumber,
            value: dep.value,
          })),
        };
        
        console.log("📤 Sending subscription data:", createParams);
        const response = await MedicalInsuranceApi.subscriptions.create(createParams);
        console.log("✅ Subscription created successfully:", response);
        toast.success(t("employeeAddedSuccessfully"));
      }
      
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error("❌ Error saving employee:", error);
      console.error("❌ Error status:", error?.response?.status);
      console.error("❌ Error response data:", error?.response?.data);
      console.error("❌ Error response headers:", error?.response?.headers);
      console.error("❌ Full error:", JSON.stringify(error, null, 2));
      
      // Try to get validation errors
      if (error?.response?.data?.errors) {
        console.error("❌ Validation errors:", error.response.data.errors);
        toast.error(error.response.data.errors[0]?.message || t("saveError"));
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(t("saveError"));
      }
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
      toast.error(t("enterName") + " " + t("enterResidenceNumber"));
      return;
    }

    if (editingDependent) {
      setDependents(prev =>
        prev.map(dep => (dep.id === editingDependent.id ? { ...dependentFormData, id: editingDependent.id } : dep))
      );
      toast.success(t("dependentUpdatedSuccessfully"));
    } else {
      setDependents(prev => [...prev, { ...dependentFormData, id: Date.now() }]);
      toast.success(t("dependentAddedSuccessfully"));
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
    toast.success(t("dependentDeletedSuccessfully"));
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
              // Edit mode: single employee - show employees with policies
              <Autocomplete
                options={employees.filter(emp => {
                  if (!employeeSearchQuery) return true;
                  const userName = emp?.user?.name || emp?.name || emp?.employee_name || '';
                  const subscriptionNo = emp?.subscription_no || '';
                  const searchLower = employeeSearchQuery.toLowerCase();
                  return userName.toLowerCase().includes(searchLower) || 
                         subscriptionNo.toLowerCase().includes(searchLower);
                })}
                getOptionLabel={(option) => {
                  const userName = option?.user?.name || option?.name || option?.employee_name;
                  const subscriptionNo = option?.subscription_no;
                  if (userName) {
                    return subscriptionNo ? `${userName} (${subscriptionNo})` : userName;
                  }
                  return `Subscription No: ${subscriptionNo || 'N/A'} (ID: ${option?.employee_id?.substring(0, 8)}...)`;
                }}
                value={employees.find(emp => emp.id === formData.employeeId) || null}
                onChange={(event, newValue) => {
                  const userName = newValue?.user?.name || newValue?.name || newValue?.employee_name;
                  handleInputChange("name", newValue ? [userName] : []);
                  if (newValue) {
                    handleInputChange("employeeId", newValue.id); // subscription_id
                    handleInputChange("employee_id", newValue.employee_id); // actual employee_id
                    // Auto-select policy from subscription
                    if (newValue.policy_id || newValue.medical_insurance_id) {
                      handleInputChange("policyId", newValue.policy_id || newValue.medical_insurance_id);
                    }
                  }
                }}
                onInputChange={(event, newInputValue) => {
                  setEmployeeSearchQuery(newInputValue);
                }}
                loading={loadingEmployees}
                noOptionsText="لا توجد نتائج"
                loadingText="جاري التحميل..."
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
                options={employees.filter(emp => {
                  if (!employeeSearchQuery) return true;
                  const userName = emp?.user?.name || emp?.name || emp?.employee_name || '';
                  const subscriptionNo = emp?.subscription_no || '';
                  const searchLower = employeeSearchQuery.toLowerCase();
                  return userName.toLowerCase().includes(searchLower) || 
                         subscriptionNo.toLowerCase().includes(searchLower);
                })}
                getOptionLabel={(option) => {
                  const userName = option?.user?.name || option?.name || option?.employee_name;
                  const subscriptionNo = option?.subscription_no;
                  if (userName) {
                    return subscriptionNo ? `${userName} (${subscriptionNo})` : userName;
                  }
                  return `Subscription No: ${subscriptionNo || 'N/A'} (ID: ${option?.employee_id?.substring(0, 8)}...)`;
                }}
                value={selectedEmployees}
                onChange={(event, newValue) => {
                  setSelectedEmployees(newValue);
                  handleInputChange("name", newValue.map(emp => emp?.user?.name || emp?.name || emp?.employee_name));
                  // Store employee IDs as well and auto-select policy
                  if (newValue.length > 0) {
                    handleInputChange("employeeId", newValue[0].id); // subscription_id
                    handleInputChange("employee_id", newValue[0].employee_id); // actual employee_id
                    // Auto-select policy from subscription
                    if (newValue[0].policy_id || newValue[0].medical_insurance_id) {
                      handleInputChange("policyId", newValue[0].policy_id || newValue[0].medical_insurance_id);
                    }
                  }
                }}
                onInputChange={(event, newInputValue) => {
                  setEmployeeSearchQuery(newInputValue);
                }}
                loading={loadingEmployees}
                noOptionsText="لا توجد نتائج"
                loadingText="جاري التحميل..."
                renderTags={(value: readonly any[], getTagProps) =>
                  value.map((option: any, index: number) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    const userName = option?.user?.name || option?.name || option?.employee_name || 'موظف';
                    return (
                      <Chip
                        key={key}
                        variant="outlined"
                        label={userName}
                        {...tagProps}
                        sx={{
                          background: "rgba(236, 72, 153, 0.2)",
                          color: "white",
                          borderColor: "rgba(236, 72, 153, 0.5)",
                          "& .MuiChip-deleteIcon": {
                            color: "rgba(255, 255, 255, 0.7)",
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
                  <TextField
                    fullWidth
                    label="البوليصة القديمة"
                    value={formData.oldPolicyId}
                    disabled
                    size="large"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 56,
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="القيمة القديمة"
                    value={formData.oldValue}
                    disabled
                    size="large"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 56,
                      },
                    }}
                  />
                </>
              )}
              <FormControl fullWidth size="large">
                <InputLabel>بوليصة جديدة</InputLabel>
                <Select
                  value={formData.policyId}
                  label="بوليصة جديدة"
                  onChange={(e) => handleInputChange("policyId", e.target.value)}
                  disabled={loadingInsurances}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                    },
                  }}
                >
                  <MenuItem value="">اختر البوليصة</MenuItem>
                  {insurances.map((insurance) => (
                    <MenuItem key={insurance.id} value={insurance.id}>
                      {insurance.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="القيمة الجديدة"
                value={formData.value}
                onChange={(e) => handleInputChange("value", e.target.value)}
                type="number"
                size="large"
                placeholder="أدخل القيمة"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 56,
                  },
                }}
              />
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr 1fr" }, gap: 3 }}>
              {/* Policy - Editable */}
              <Box sx={{ position: "relative" }}>
                <FormControl fullWidth size="large">
                  <InputLabel>البوليصة {isEditMode && formData.oldPolicyId && `(القديمة: ${insurances.find(i => i.id === formData.oldPolicyId)?.name || formData.oldPolicyId})`}</InputLabel>
                  <Select
                    value={formData.policyId}
                    label={`البوليصة ${isEditMode && formData.oldPolicyId ? `(القديمة: ${insurances.find(i => i.id === formData.oldPolicyId)?.name || formData.oldPolicyId})` : ''}`}
                    onChange={(e) => handleInputChange("policyId", e.target.value)}
                    disabled={loadingInsurances}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 56,
                        paddingLeft: "40px",
                      },
                    }}
                  >
                    <MenuItem value="">اختر البوليصة</MenuItem>
                    {insurances.map((insurance) => (
                      <MenuItem key={insurance.id} value={insurance.id}>
                        {insurance.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Pencil 
                  size={20} 
                  style={{ 
                    position: "absolute", 
                    left: 15, 
                    top: "50%", 
                    transform: "translateY(-50%)", 
                    color: "rgba(236, 72, 153, 0.7)",
                    cursor: "pointer"
                  }} 
                />
              </Box>
              
              {/* Category - Editable */}
              <Box sx={{ position: "relative" }}>
                <FormControl fullWidth size="large">
                  <InputLabel>الفئة</InputLabel>
                  <Select
                    value={formData.categoryId}
                    label="الفئة"
                    onChange={(e) => handleInputChange("categoryId", e.target.value)}
                    disabled={loadingCategories}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 56,
                        paddingLeft: "40px",
                      },
                    }}
                  >
                    <MenuItem value="">اختر الفئة</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Pencil 
                  size={20} 
                  style={{ 
                    position: "absolute", 
                    left: 15, 
                    top: "50%", 
                    transform: "translateY(-50%)", 
                    color: "rgba(236, 72, 153, 0.7)",
                    cursor: "pointer"
                  }} 
                />
              </Box>
              
              {/* Value - Editable */}
              <Box sx={{ position: "relative" }}>
                <TextField
                  fullWidth
                  label={`القيمة ${isEditMode && formData.oldValue ? `(القديمة: ${formData.oldValue})` : ''}`}
                  value={formData.value}
                  onChange={(e) => handleInputChange("value", e.target.value)}
                  type="number"
                  size="large"
                  placeholder="أدخل القيمة"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                      paddingLeft: "40px",
                    },
                  }}
                />
                <Pencil 
                  size={20} 
                  style={{ 
                    position: "absolute", 
                    left: 15, 
                    top: "50%", 
                    transform: "translateY(-50%)", 
                    color: "rgba(236, 72, 153, 0.7)",
                    cursor: "pointer"
                  }} 
                />
              </Box>
              
              {/* Subscription Number - Editable */}
              <Box sx={{ position: "relative" }}>
                <TextField
                  fullWidth
                  label={`رقم المشترك ${isEditMode && formData.oldSubscriberId ? `(القديم: ${formData.oldSubscriberId})` : ''}`}
                  value={formData.subscriberId}
                  onChange={(e) => handleInputChange("subscriberId", e.target.value)}
                  placeholder="أدخل رقم المشترك"
                  size="large"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                      paddingLeft: "40px",
                    },
                  }}
                />
                <Pencil 
                  size={20} 
                  style={{ 
                    position: "absolute", 
                    left: 15, 
                    top: "50%", 
                    transform: "translateY(-50%)", 
                    color: "rgba(236, 72, 153, 0.7)",
                    cursor: "pointer"
                  }} 
                />
              </Box>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 3 }}>
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
              <TextField
                fullWidth
                label="القيمة"
                value={formData.value}
                disabled
                size="large"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 56,
                  },
                }}
              />
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
