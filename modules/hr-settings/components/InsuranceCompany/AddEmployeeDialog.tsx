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
import { X, Pencil, ArrowLeft } from "lucide-react";
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
  const [subscriptions, setSubscriptions] = useState<any[]>([]); // For edit mode - employees with insurance
  const [allSubscriptions, setAllSubscriptions] = useState<any[]>([]); // For add mode - all subscriptions to check which employees have insurance
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
    employee_id: "", // user_id from company-users/employees API
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
    residenceNumber: "",
  });

  const [selectedEmployees, setSelectedEmployees] = useState<any[]>([]);

  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [showSummaryTable, setShowSummaryTable] = useState(true);
  const [selectedEmployeeForDetails, setSelectedEmployeeForDetails] = useState<string | null>(null);
  const [dependentsDetailsDialogOpen, setDependentsDetailsDialogOpen] = useState(false);
  const [selectedEmployeeForDependents, setSelectedEmployeeForDependents] = useState<any>(null);

  // State to hold individual data for each employee (policy, value, subscription_no, category)
  const [employeeData, setEmployeeData] = useState<Record<string, {
    policyId: string;
    value: string;
    subscriptionNo: string;
    categoryId: string;
    oldPolicyId: string;
    oldValue: string;
    oldSubscriptionNo: string;
    oldCategoryId: string;
  }>>({});

  // Fetch employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!open) return;

      setLoadingEmployees(true);
      try {
        // Fetch company employees with filter based on mode
        const response = await AllProjectsApi.getCompanyUsers({
          name: employeeSearchQuery || undefined,
          per_page: 10,
          has_medical_insurance_subscription: isEditMode ? 1 : 0,
          type_allowance_code: "saving",
        });

        let employeesList = [];
        if (response?.data?.payload) {
          employeesList = response.data.payload;
        } else if (Array.isArray(response?.data?.data)) {
          employeesList = response.data.data;
        } else if (Array.isArray(response?.data)) {
          employeesList = response.data;
        }

        console.log("👥 Loaded employees:", employeesList.length, "employees");

        if (isEditMode) {
          // In edit mode, set both subscriptions and employees state
          setSubscriptions(employeesList);
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
  }, [open, employeeSearchQuery, isEditMode, allSubscriptions]);

  // Fetch all subscriptions to check which employees have insurance (for add mode)
  useEffect(() => {
    const fetchAllSubscriptions = async () => {
      if (!open || isEditMode) return;

      try {
        const response = await MedicalInsuranceApi.subscriptions.list({
          page: 1,
          per_page: 10,
        });

        if (response?.data?.payload) {
          setAllSubscriptions(response.data.payload);
          console.log("👥 Loaded all subscriptions:", response.data.payload.length, "subscriptions");
        }
      } catch (error) {
        console.error("Error fetching all subscriptions:", error);
      }
    };

    fetchAllSubscriptions();
  }, [open, isEditMode]);

  // Fetch insurances from API
  useEffect(() => {
    const fetchInsurances = async () => {
      if (!open) return;

      console.log("🔄 Fetching insurances...");
      setLoadingInsurances(true);
      try {
        const response = await MedicalInsuranceApi.list({
          per_page: 10,
        });

        if (response?.data?.payload) {
          setInsurances(response.data.payload);
          console.log("✅ Loaded insurances:", response.data.payload.length, "insurances");
          console.log("📋 First insurance:", response.data.payload[0]);
        } else {
          console.log("⚠️ No insurances payload found");
        }
      } catch (error) {
        console.error("❌ Error fetching insurances:", error);
        toast.error(t("saveError") || "حدث خطأ أثناء تحميل التأمينات");
      } finally {
        setLoadingInsurances(false);
        console.log("✅ Insurances loading finished");
      }
    };

    fetchInsurances();
  }, [open]);

  // Fetch categories from API based on selected insurance
  useEffect(() => {
    const fetchCategories = async () => {
      if (!open) return;

      // Get the first employee's policyId for categories fetching
      const firstEmployeeId = selectedEmployees[0]?.employee_id || selectedEmployees[0]?.user_id || selectedEmployees[0]?.id;
      const policyId = firstEmployeeId ? employeeData[firstEmployeeId]?.policyId : formData.policyId;

      if (!policyId) return;

      setLoadingCategories(true);
      try {
        const response = await MedicalInsuranceApi.categories.list(policyId, {
          page: 1,
          per_page: 10,
        });

        if (response?.data?.payload) {
          setCategories(response.data.payload);
          console.log("✅ Loaded categories:", response.data.payload.length, "categories");
        } else {
          setCategories([]);
          console.log("⚠️ No categories found for this insurance");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // If 404, it means no categories exist yet - that's okay
        if (error?.response?.status === 404) {
          setCategories([]);
          console.log("ℹ️ No categories found (404)");
        } else {
          toast.error(t("saveError") || "حدث خطأ أثناء تحميل الفئات");
        }
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [open, selectedEmployees, employeeData]);

  // Reset form when dialog opens/closes or editing employee changes
  useEffect(() => {
    if (open) {
      setCurrentStep(0);
      if (editingEmployee) {
        setIsEditMode(true);
        setFormData({
          name: editingEmployee.name ? (Array.isArray(editingEmployee.name) ? editingEmployee.name : [editingEmployee.name]) : [],
          employee_id: editingEmployee.employee_id || editingEmployee.user_id || "",
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
          residenceNumber: editingEmployee.residenceNumber || editingEmployee.residence_number || "",
        });

        // Fetch dependents from API
        console.log("🔍 Editing employee data:", editingEmployee);
        console.log("🔍 Using subscription ID:", editingEmployee.id);
        fetchDependents(editingEmployee.id);
      } else {
        setIsEditMode(false);
        setFormData({
          name: [],
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
          residenceNumber: "",
        });
        setSelectedEmployees([]);
        setDependents([]);
      }
    }
  }, [open, editingEmployee]);

  // Fetch dependents from API (now from subscription's family_members)
  const fetchDependents = async (subscriptionId: string) => {
    try {
      console.log("🔄 Fetching subscription with family members:", subscriptionId);
      const response = await MedicalInsuranceApi.subscriptions.show(subscriptionId);
      console.log("📋 Fetched subscription response:", response);

      const subscription = response.data.payload;
      const familyMembers = subscription.family_members || [];
      console.log("📋 Family members:", familyMembers);

      // Map API response to local format
      const mappedDependents = familyMembers.map((member: any) => ({
        id: member.id,
        name: member.name,
        residenceNumber: member.national_id,
        relationship: member.relation,
        subscriberNumber: member.subscription_no || "",
        value: member.amount?.toString() || "0",
      }));

      console.log("✅ Mapped dependents:", mappedDependents);
      console.log("✅ Dependents count:", mappedDependents.length);
      setDependents(mappedDependents);
    } catch (error) {
      console.error("❌ Error fetching dependents:", error);
      // If 404 or error, set empty array
      setDependents([]);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      // Validation for Step 0 (Employee Selection)
      if (currentStep === 0) {
        if (selectedEmployees.length === 0) {
          toast.error("يرجى اختيار موظف واحد على الأقل");
          return;
        }
      }

      // Validation for Step 1 (Policy Selection)
      if (currentStep === 1) {
        for (const employee of selectedEmployees) {
          const employeeId = employee.employee_id || employee.user_id || employee.id;
          const data = employeeData[employeeId] || {};

          if (!data.policyId) {
            toast.error(`يرجى اختيار البوليصة للموظف: ${employee.user?.name || employee.employee_name || employee.name || 'موظف'}`);
            return;
          }
          if (!data.categoryId) {
            toast.error(`يرجى اختيار الفئة للموظف: ${employee.user?.name || employee.employee_name || employee.name || 'موظف'}`);
            return;
          }
          if (!data.value) {
            toast.error(`يرجى إدخال القيمة للموظف: ${employee.user?.name || employee.employee_name || employee.name || 'موظف'}`);
            return;
          }
        }
      }

      // Validation for Step 2 (Subscriber Data)
      if (currentStep === 2) {
        for (const employee of selectedEmployees) {
          const employeeId = employee.employee_id || employee.user_id || employee.id;
          const data = employeeData[employeeId] || {};

          if (!data.subscriptionNo) {
            toast.error(`يرجى إدخال رقم المشترك للموظف: ${employee.user?.name || employee.employee_name || employee.name || 'موظف'}`);
            return;
          }
        }
      }

      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    // Step 0: Employee Selection
    if (currentStep === 0) {
      return selectedEmployees.length > 0;
    }

    // Step 1: Policy Selection
    if (currentStep === 1) {
      for (const employee of selectedEmployees) {
        const employeeId = employee.employee_id || employee.user_id || employee.id;
        const data = employeeData[employeeId] || {};
        if (!data.policyId || !data.categoryId || !data.value) {
          return false;
        }
      }
      return true;
    }

    // Step 2: Subscriber Data
    if (currentStep === 2) {
      for (const employee of selectedEmployees) {
        const employeeId = employee.employee_id || employee.user_id || employee.id;
        const data = employeeData[employeeId] || {};
        if (!data.subscriptionNo) {
          return false;
        }
      }
      return true;
    }

    // Steps 3 and 4 are always valid
    return true;
  };

  const handleSubmit = async () => {
    if (selectedEmployees.length === 0) {
      toast.error(t("selectEmployee") || "يرجى اختيار الموظفين");
      return;
    }

    // Validate each employee has required data
    for (const employee of selectedEmployees) {
      const employeeId = employee.employee_id || employee.user_id || employee.id;
      const data = employeeData[employeeId] || {};

      if (!data.policyId) {
        toast.error(`يرجى اختيار بوليصة للموظف: ${employee.user?.name || employee.employee_name || employee.name}`);
        return;
      }

      if (!data.subscriptionNo) {
        toast.error(`يرجى إدخال رقم المشترك للموظف: ${employee.user?.name || employee.employee_name || employee.name}`);
        return;
      }

      if (!data.value) {
        toast.error(`يرجى إدخال القيمة للموظف: ${employee.user?.name || employee.employee_name || employee.name}`);
        return;
      }
    }

    try {
      // Prepare subscription items for all selected employees
      const subscriptionItems = selectedEmployees.map((employee: any) => {
        const employeeId = employee.employee_id || employee.user_id || employee.id;
        const data = employeeData[employeeId] || {};

        // Use individual data for each employee from employeeData state
        const policyId = data.policyId || formData.policyId;
        const amount = data.value || formData.value;
        const subscriptionNo = data.subscriptionNo || formData.subscriberId;
        const categoryId = data.categoryId || formData.categoryId;

        return {
          id: employee.id, // Include ID for update mode
          user_id: employeeId,
          medical_insurance_id: policyId,
          medical_insurance_category_id: categoryId || null,
          amount: parseFloat(amount) || 0,
          subscription_no: subscriptionNo,
          status: editingEmployee ? 1 : 0,
          family_members: dependents.map(dep => ({
            name: dep.name,
            national_id: dep.residenceNumber,
            relation: dep.relationship,
            amount: parseFloat(dep.value) || 0,
            subscription_no: dep.subscriberNumber || null,
          })),
        };
      });

      console.log("📤 Subscription items for all employees:", subscriptionItems);

      if (editingEmployee) {
        // Update subscriptions - wrap in subscriptions array
        const updateParams = {
          subscriptions: subscriptionItems
        };

        console.log("📤 Updating subscription data:", updateParams);
        await MedicalInsuranceApi.subscriptions.update(updateParams);
        toast.success(`تم تحديث ${subscriptionItems.length} موظف بنجاح`);
      } else {
        console.log("📝 formData:", formData);
        console.log("📝 selectedEmployees:", selectedEmployees);

        // Create subscriptions - wrap in subscriptions array
        const createParams = {
          subscriptions: subscriptionItems
        };

        console.log("📤 Sending subscription data:", createParams);
        console.log("📤 user_id:", createParams.user_id);
        console.log("📤 family_members:", createParams.family_members);
        const response = await MedicalInsuranceApi.subscriptions.create(createParams);
        console.log("✅ Subscriptions created successfully:", response);
        toast.success(`تم إضافة ${subscriptionItems.length} موظف بنجاح`);
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
              // Edit mode: multiple employees - show employees with insurance
              <Autocomplete
                multiple
                options={subscriptions}
                getOptionLabel={(option) => {
                  const userName = option?.user?.name || option?.employee_name || option?.name || '';
                  return userName || 'موظف';
                }}
                isOptionEqualToValue={(option, value) => {
                  const optionId = option?.employee_id || option?.user_id || option?.id;
                  const valueId = value?.employee_id || value?.user_id || value?.id;
                  return optionId === valueId;
                }}
                value={selectedEmployees}
                onChange={async (event, newValue) => {
                  setSelectedEmployees(newValue);
                  handleInputChange("name", newValue.map(emp => emp?.user?.name || emp?.employee_name || emp?.name || ''));

                  // Initialize employeeData for all selected employees
                  const newEmployeeData: Record<string, any> = {};
                  newValue.forEach((emp: any) => {
                    const employeeId = emp.employee_id || emp.user_id || emp.id;
                    const currentPolicyId = emp.medical_insurance_id || emp.policy_id;
                    newEmployeeData[employeeId] = {
                      policyId: selectedInsuranceId || currentPolicyId || formData.policyId || "",
                      value: emp.amount?.toString() || emp.value?.toString() || formData.value || "",
                      subscriptionNo: emp.subscription_no || formData.subscriberId || "",
                      categoryId: emp.medical_insurance_category_id || formData.categoryId || "",
                      oldPolicyId: currentPolicyId || "",
                      oldValue: emp.amount?.toString() || emp.value?.toString() || "",
                      oldSubscriptionNo: emp.subscription_no || "",
                      oldCategoryId: emp.medical_insurance_category_id || formData.categoryId || "",
                    };
                  });
                  setEmployeeData(newEmployeeData);

                  if (newValue.length > 0) {
                    const firstEmployee = newValue[0];
                    handleInputChange("employee_id", firstEmployee.employee_id || firstEmployee.user_id);

                    // Fill old policy data from first employee
                    const policyId = firstEmployee.medical_insurance_id || firstEmployee.policy_id;
                    if (policyId) {
                      handleInputChange("oldPolicyId", policyId);
                      handleInputChange("policyId", policyId);
                    }

                    // Fill old value from first employee
                    const amount = firstEmployee.amount || firstEmployee.value;
                    if (amount) {
                      handleInputChange("oldValue", amount?.toString() || "");
                      handleInputChange("value", amount?.toString() || "");
                    }

                    // Fill old subscriber number from first employee
                    const subscriptionNo = firstEmployee.subscription_no;
                    if (subscriptionNo) {
                      handleInputChange("oldSubscriberId", subscriptionNo);
                      handleInputChange("subscriberId", subscriptionNo);
                    }

                    // Load dependents for first employee
                    try {
                      await fetchDependents(firstEmployee.id);
                      console.log("✅ Loaded dependents for first selected subscription");
                    } catch (error) {
                      console.error("❌ Error loading dependents:", error);
                    }
                  } else {
                    // Clear form if no employees selected
                    handleInputChange("employee_id", "");
                    handleInputChange("oldPolicyId", "");
                    handleInputChange("oldValue", "");
                    handleInputChange("oldSubscriberId", "");
                    setDependents([]);
                    setEmployeeData({});
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
                    const userName = option?.user?.name || option?.employee_name || option?.name || 'موظف';
                    const employeeId = option?.employee_id || option?.user_id || option?.id || index;
                    return (
                      <Chip
                        key={`${employeeId}-${key}`}
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
            ) : (
              // Add mode: multiple employees
              <Autocomplete
                multiple
                options={employees}
                getOptionLabel={(option) => {
                  const userName = option?.name || '';
                  return userName || `ID: ${option?.id?.substring(0, 8)}...`;
                }}
                isOptionEqualToValue={(option, value) => {
                  const optionId = option?.id || option?.user_id;
                  const valueId = value?.id || value?.user_id;
                  return optionId === valueId;
                }}
                value={selectedEmployees}
                onChange={async (event, newValue) => {
                  setSelectedEmployees(newValue);
                  handleInputChange("name", newValue.map(emp => emp?.name || ''));

                  // Initialize employeeData for all selected employees
                  const newEmployeeData: Record<string, any> = {};
                  newValue.forEach((emp: any) => {
                    const employeeId = emp.id || emp.user_id;
                    newEmployeeData[employeeId] = {
                      policyId: selectedInsuranceId || formData.policyId || "",
                      value: formData.value || "",
                      subscriptionNo: formData.subscriberId || "",
                      categoryId: formData.categoryId || "",
                      oldPolicyId: "",
                      oldValue: "",
                      oldSubscriptionNo: "",
                      oldCategoryId: "",
                    };
                  });

                  // Check for existing subscriptions for each employee
                  if (newValue.length > 0) {
                    const firstEmployee = newValue[0];
                    handleInputChange("employee_id", firstEmployee.id);

                    try {
                      const subsResponse = await MedicalInsuranceApi.subscriptions.list({
                        page: 1,
                        per_page: 10,
                      });

                      let subscriptionsList = [];
                      if (subsResponse?.data?.payload) {
                        subscriptionsList = subsResponse.data.payload;
                      } else if (Array.isArray(subsResponse?.data?.data)) {
                        subscriptionsList = subsResponse.data.data;
                      } else if (Array.isArray(subsResponse?.data)) {
                        subscriptionsList = subsResponse.data;
                      }

                      // Check each employee for existing subscription
                      newValue.forEach((emp: any) => {
                        const employeeId = emp.id || emp.user_id;
                        const existingSub = subscriptionsList.find(
                          sub => (sub.employee_id === employeeId || sub.user_id === employeeId)
                        );

                        if (existingSub) {
                          console.log("🔍 Found existing subscription for employee:", existingSub);
                          newEmployeeData[employeeId] = {
                            policyId: existingSub.medical_insurance_id || existingSub.policy_id || formData.policyId || "",
                            value: existingSub.amount?.toString() || existingSub.value?.toString() || formData.value || "",
                            subscriptionNo: existingSub.subscription_no || formData.subscriberId || "",
                            categoryId: existingSub.medical_insurance_category_id || formData.categoryId || "",
                            oldPolicyId: existingSub.medical_insurance_id || existingSub.policy_id || "",
                            oldValue: existingSub.amount?.toString() || existingSub.value?.toString() || "",
                            oldSubscriptionNo: existingSub.subscription_no || "",
                            oldCategoryId: existingSub.medical_insurance_category_id || formData.categoryId || "",
                          };
                        }
                      });

                      setEmployeeData(newEmployeeData);

                      // Load dependents for first employee if exists
                      const firstEmployeeSub = subscriptionsList.find(
                        sub => (sub.employee_id === firstEmployee.id || sub.user_id === firstEmployee.id)
                      );
                      if (firstEmployeeSub) {
                        try {
                          await fetchDependents(firstEmployeeSub.id);
                          console.log("✅ Loaded dependents for existing subscription");
                        } catch (error) {
                          console.error("❌ Error loading dependents:", error);
                        }
                      }
                    } catch (error) {
                      console.error("❌ Error checking existing subscription:", error);
                    }
                  } else {
                    setEmployeeData({});
                    setDependents([]);
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
                    const userName = option?.name || 'موظف';
                    const employeeId = option?.id || option?.user_id || index;
                    return (
                      <Chip
                        key={`${employeeId}-${key}`}
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
        console.log("📊 Step 1 - Selected Employees:", selectedEmployees);
        console.log("📊 Step 1 - Employee Data:", employeeData);
        console.log("📊 Step 1 - Loading Insurances:", loadingInsurances);
        console.log("📊 Step 1 - Insurances Count:", insurances.length);

        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Typography sx={{ color: "white", fontSize: 18, fontWeight: 600 }}>
              بيانات الموظفين المختارين
            </Typography>

            <TableContainer sx={{ maxHeight: 400 }}>
              <Table>
                <TableHead sx={{ background: "rgba(30, 41, 59, 0.5)" }}>
                  <TableRow>
                    <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>الاسم</TableCell>
                    {isEditMode && (
                      <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>
                         القديمة</TableCell>
                    )}
                    <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>{isEditMode ? "البوليصة الجديدة" : "البوليصة"}</TableCell>
                    {isEditMode && (
                      <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>الفئة القديمة</TableCell>
                    )}
                    <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>{isEditMode ? "الفئة الجديدة" : "الفئة"}</TableCell>
                    {isEditMode && (
                      <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>القيمة القديمة</TableCell>
                    )}
                    <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>{isEditMode ? "القيمة الجديدة" : "القيمة"}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedEmployees.map((employee: any, index: number) => {
                    const employeeId = employee.employee_id || employee.user_id || employee.id;
                    const data = employeeData[employeeId] || {
                      policyId: formData.policyId || "",
                      value: formData.value || "",
                      subscriptionNo: formData.subscriberId || "",
                      categoryId: formData.categoryId || "",
                      oldPolicyId: "",
                      oldValue: "",
                      oldSubscriptionNo: "",
                      oldCategoryId: "",
                    };

                    return (
                      <TableRow
                        key={`${employeeId}-${index}`}
                        sx={{
                          borderBottom: "1px solid rgba(139, 92, 246, 0.3)",
                          "&:hover": {
                            background: "rgba(30, 41, 59, 0.3)",
                          },
                        }}
                      >
                        <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>
                          {employee.user?.name || employee.employee_name || employee.name || 'موظف'}
                        </TableCell>
                        {isEditMode && (
                          <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>
                            {insurances.find(i => i.id === data.oldPolicyId)?.name || data.oldPolicyId || "-"}
                          </TableCell>
                        )}
                        <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>
                          <FormControl fullWidth size="small">
                            <Select
                              value={data.policyId}
                              onChange={(e) => {
                                const newData = { ...employeeData };
                                newData[employeeId] = {
                                  ...newData[employeeId],
                                  policyId: e.target.value,
                                  categoryId: "", // Reset category when policy changes
                                };
                                setEmployeeData(newData);
                              }}
                              disabled={loadingInsurances}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  color: "white",
                                  height: 40,
                                },
                                "& .MuiInputLabel-root": {
                                  color: "rgba(255, 255, 255, 0.7)",
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
                        </TableCell>
                        {isEditMode && (
                          <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>
                            {categories.find(c => c.id === data.oldCategoryId)?.name || data.oldCategoryId || "-"}
                          </TableCell>
                        )}
                        <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>
                          <FormControl fullWidth size="small">
                            <Select
                              value={data.categoryId}
                              onChange={(e) => {
                                const newData = { ...employeeData };
                                newData[employeeId] = {
                                  ...newData[employeeId],
                                  categoryId: e.target.value,
                                };
                                setEmployeeData(newData);
                              }}
                              disabled={loadingCategories || !data.policyId}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  color: "white",
                                  height: 40,
                                },
                                "& .MuiInputLabel-root": {
                                  color: "rgba(255, 255, 255, 0.7)",
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
                        </TableCell>
                        {isEditMode && (
                          <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>
                            {data.oldValue || "-"}
                          </TableCell>
                        )}
                        <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>
                          <TextField
                            fullWidth
                            value={data.value}
                            onChange={(e) => {
                              const newData = { ...employeeData };
                              newData[employeeId] = {
                                ...newData[employeeId],
                                value: e.target.value,
                              };
                              setEmployeeData(newData);
                            }}
                            type="number"
                            size="small"
                            placeholder="أدخل القيمة"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                color: "white",
                                height: 40,
                              },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Typography sx={{ color: "white", fontSize: 18, fontWeight: 600 }}>
              بيانات المشترك لكل موظف
            </Typography>

            <TableContainer sx={{ maxHeight: 400 }}>
              <Table>
                <TableHead sx={{ background: "rgba(30, 41, 59, 0.5)" }}>
                  <TableRow>
                    <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>الاسم</TableCell>
                    {isEditMode && (
                      <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>رقم المشترك القديم</TableCell>
                    )}
                    <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>{isEditMode ? "رقم المشترك الجديد" : "رقم المشترك"}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedEmployees.map((employee: any, index: number) => {
                    const employeeId = employee.employee_id || employee.user_id || employee.id;
                    const data = employeeData[employeeId] || {};

                    return (
                      <TableRow
                        key={`${employeeId}-${index}`}
                        sx={{
                          borderBottom: "1px solid rgba(139, 92, 246, 0.3)",
                          "&:hover": {
                            background: "rgba(30, 41, 59, 0.3)",
                          },
                        }}
                      >
                        <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>
                          {employee.user?.name || employee.employee_name || employee.name || 'موظف'}
                        </TableCell>
                        {isEditMode && (
                          <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>
                            {data.oldSubscriptionNo || "-"}
                          </TableCell>
                        )}
                        <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>
                          <TextField
                            fullWidth
                            value={data.subscriptionNo || ""}
                            onChange={(e) => {
                              const newData = { ...employeeData };
                              newData[employeeId] = {
                                ...newData[employeeId],
                                subscriptionNo: e.target.value,
                              };
                              setEmployeeData(newData);
                            }}
                            size="small"
                            placeholder="أدخل رقم المشترك"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                color: "white",
                                height: 40,
                              },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Typography sx={{ color: "white", fontSize: 18, fontWeight: 600 }}>
              العائلون لكل موظف
            </Typography>

            <TableContainer sx={{ maxHeight: 400 }}>
              <Table>
                <TableHead sx={{ background: "rgba(30, 41, 59, 0.5)" }}>
                  <TableRow>
                    <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>الاسم</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>القيمة</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>عدد العائلون</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>إجراءات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedEmployees.map((employee: any, index: number) => {
                    const employeeId = employee.employee_id || employee.user_id || employee.id;

                    return (
                      <TableRow
                        key={`${employeeId}-${index}`}
                        sx={{
                          borderBottom: "1px solid rgba(139, 92, 246, 0.3)",
                          "&:hover": {
                            background: "rgba(30, 41, 59, 0.3)",
                          },
                        }}
                      >
                        <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>
                          {employee.user?.name || employee.employee_name || employee.name || 'موظف'}
                        </TableCell>
                        <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>
                          {employeeData[employeeId]?.value || "-"}
                        </TableCell>
                        <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>
                          {dependents.length} عالون
                        </TableCell>
                        <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>
                          <Button
                            onClick={() => setDependentsDialogOpen(true)}
                            variant="contained"
                            size="small"
                            disabled={employee.type_privilege === "Individual"}
                            title={employee.type_privilege === "Individual" ? "لا يمكن إضافة عائلون للموظف الفردي" : ""}
                            sx={{ fontSize: 12, "&.Mui-disabled": { opacity: 0.4 } }}
                          >
                            إدارة العائلون
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );

      case 4:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Button
              onClick={() => setShowSummaryTable(!showSummaryTable)}
              sx={{
                color: "white",
                fontSize: 18,
                fontWeight: 600,
                textTransform: "none",
                justifyContent: "flex-start",
                px: 0,
                "&:hover": {
                  background: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              {showSummaryTable ? "▼ ملخص البيانات لكل موظف" : "▶ ملخص البيانات لكل موظف"}
            </Button>

            {showSummaryTable && (
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table>
                  <TableHead sx={{ background: "rgba(30, 41, 59, 0.5)" }}>
                    <TableRow>
                      <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>الاسم</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>البوليصة</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>الفئة</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>القيمة</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>رقم المشترك</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 14 }}>عدد العائلون</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedEmployees.map((employee: any, index: number) => {
                      const employeeId = employee.employee_id || employee.user_id || employee.id;
                      const data = employeeData[employeeId] || {};

                      return (
                        <>
                          <TableRow
                            key={`${employeeId}-${index}`}
                            sx={{
                              borderBottom: "1px solid rgba(139, 92, 246, 0.3)",
                              "&:hover": {
                                background: "rgba(30, 41, 59, 0.3)",
                              },
                            }}
                          >
                            <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>
                              {employee.user?.name || employee.employee_name || employee.name || 'موظف'}
                            </TableCell>
                            <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>
                              {insurances.find(i => i.id === data.policyId)?.name || data.policyId || "-"}
                            </TableCell>
                            <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>
                              {categories.find(c => c.id === data.categoryId)?.name || data.categoryId || "-"}
                            </TableCell>
                            <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>
                              {data.value || "-"}
                            </TableCell>
                            <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>
                              {data.subscriptionNo || "-"}
                            </TableCell>
                            <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>
                              <Button
                                onClick={() => {
                                  setSelectedEmployeeForDependents(employee);
                                  setDependentsDetailsDialogOpen(true);
                                }}
                                sx={{
                                  color: "rgba(255, 255, 255, 0.9)",
                                  fontSize: 14,
                                  textTransform: "none",
                                  px: 0,
                                  justifyContent: "flex-start",
                                  "&:hover": {
                                    background: "transparent",
                                    textDecoration: "underline",
                                    color: "rgba(255, 255, 255, 1)",
                                  },
                                }}
                              >
                                {dependents.length} عالون
                              </Button>
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
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
              mt: 2,
              overflowY: "auto",
            }}
          >
            {renderStepContent()}
          </Box>

          <Box
            sx={{
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              justifyContent: currentStep === 0 ? "flex-end" : "space-between",
              pt: 3,
              mt: 3,
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
              disabled={!isStepValid()}
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
            {console.log("👥 Current dependents state:", dependents)}
            {console.log("👥 Dependents count:", dependents.length)}
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
                <ArrowLeft size={24} />
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
              <ArrowLeft size={24} />
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

      {/* Dependents Details Dialog */}
      <Dialog
        open={dependentsDetailsDialogOpen}
        onClose={() => setDependentsDetailsDialogOpen(false)}
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
              تفاصيل العائلون: {selectedEmployeeForDependents?.user?.name || selectedEmployeeForDependents?.employee_name || selectedEmployeeForDependents?.name || 'موظف'}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                onClick={() => setDependentsDialogOpen(true)}
                variant="contained"
                size="small"
                sx={{ fontSize: 14 }}
              >
                إضافة
              </Button>
              <IconButton onClick={() => setDependentsDetailsDialogOpen(false)} sx={{ minWidth: "auto", p: 1 }}>
                <ArrowLeft size={24} />
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
    </>
  );
};
