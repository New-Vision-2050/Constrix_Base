"use client";

import {useTranslations} from "next-intl";
import {useState, useEffect} from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import AddNewPolicyDialog from "./AddNewPolicyDialog";
import AddCategoryDialog from "./AddCategoryDialog";
import AddEmployeeDialog from "./AddEmployeeDialog";
import {Typography, Tabs, Tab} from "@mui/material";
import {Box} from "@mui/material";
import {InsuranceProvider, useInsurance} from "./context/InsuranceContext";
import AllInsurancesTable from "./components/AllInsurancesTable";
import InsuranceTable from "./components/InsuranceTable";
import {MedicalInsuranceApi} from "@/services/api/medical-insurance";
import {MedicalInsuranceRow} from "./types";
import {toast} from "sonner";
import Pagination from "@/components/shared/Pagination/Pagination";

function InsuranceContent() {
  const t = useTranslations("hr-settings.insurance");
  const [open, setOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openEmployee, setOpenEmployee] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [selectedInsurance, setSelectedInsurance] = useState<MedicalInsuranceRow | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [paginationData, setPaginationData] = useState({ currentPage: 1, totalPages: 1, startIndex: 0, endIndex: 0, total: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {insurances, setInsurances} = useInsurance();

  // Fetch insurances on component mount
  useEffect(() => {
    fetchInsurances();
  }, []);

  // Fetch categories and employees when selectedInsurance changes
  useEffect(() => {
    if (selectedInsurance?.id) {
      console.log("🔍 Selected Insurance:", selectedInsurance);
      console.log("🔍 Insurance ID:", selectedInsurance.id);
      console.log("🔍 Insurance ID length:", selectedInsurance.id.length);
      fetchCategories();
      fetchEmployees();
    } else {
      setCategories([]);
      setEmployees([]);
    }
  }, [selectedInsurance?.id]);

  // Fetch employees when switching to employees tab
  useEffect(() => {
    if (activeTab === 1 && selectedInsurance?.id) {
      console.log("🔄 Switched to employees tab, fetching employees...");
      fetchEmployees();
    }
  }, [activeTab]);

  const fetchInsurances = async () => {
    try {
      const response = await MedicalInsuranceApi.list({
        per_page: 100, // Fetch more items
      });
      console.log("📋 Insurances from API:", response.data.payload);
      if (response.data.payload && response.data.payload.length > 0) {
        console.log("🔍 First insurance object:", response.data.payload[0]);
        console.log("🔍 Available keys:", Object.keys(response.data.payload[0]));
      }
      setInsurances(response.data.payload || []);
    } catch (error) {
      console.error("Error fetching insurances:", error);
    }
  };

  const fetchCategories = async () => {
    if (!selectedInsurance?.id) return;
    try {
      const response = await MedicalInsuranceApi.categories.list(selectedInsurance.id, {
        page: 1,
        per_page: 100,
      });
      console.log("✅ Categories fetched successfully:", response.data.payload);
      setCategories(response.data.payload || []);
    } catch (error: any) {
      // If 404, it means no categories exist yet - that's okay
      if (error?.response?.status === 404) {
        console.log("ℹ️ No categories found (404) - setting empty array");
        setCategories([]);
      } else {
        console.error("Error fetching categories:", error);
      }
    }
  };

  const fetchEmployees = async () => {
    if (!selectedInsurance?.id) {
      console.log("❌ No selected insurance, skipping fetch");
      return;
    }
    
    try {
      console.log("🔄 Fetching subscriptions...");
      const response = await MedicalInsuranceApi.subscriptions.list({
        page: 1,
        per_page: 100,
      });
      
      console.log("📋 Full API response:", response);
      console.log("📋 All subscriptions:", response.data.payload);
      console.log("🔍 Selected insurance ID:", selectedInsurance.id);
      console.log("🔍 Selected insurance ID type:", typeof selectedInsurance.id);
      
      // Show all subscriptions with their policy_ids
      if (response.data.payload && response.data.payload.length > 0) {
        console.log("📋 All subscriptions with policy_ids:");
        response.data.payload.forEach((sub: any, idx: number) => {
          console.log(`  ${idx + 1}. policy_id: ${sub.policy_id}, employee_name: ${sub.employee_name}, employee_id: ${sub.employee_id}`);
        });
      }
      
      if (response.data.payload && response.data.payload.length > 0) {
        console.log("📋 First subscription:", response.data.payload[0]);
        console.log("📋 First subscription policy_id:", response.data.payload[0].policy_id);
        console.log("📋 First subscription policy_id type:", typeof response.data.payload[0].policy_id);
      }
      
      // Filter subscriptions for the selected insurance
      const filteredEmployees = response.data.payload.filter(
        (sub: any) => {
          // Try both policy_id and medical_insurance_id (backend may use either)
          const matches = sub.policy_id === selectedInsurance.id || sub.medical_insurance_id === selectedInsurance.id;
          console.log(`Comparing: policy_id=${sub.policy_id}, medical_insurance_id=${sub.medical_insurance_id} === ${selectedInsurance.id}`, matches);
          return matches;
        }
      );
      
      console.log("✅ Filtered employees count:", filteredEmployees.length);
      console.log("✅ Filtered employees:", filteredEmployees);
      setEmployees(filteredEmployees || []);
    } catch (error: any) {
      console.error("❌ Error fetching employees:", error);
      // If 404, it means no subscriptions exist yet - that's okay
      if (error?.response?.status === 404) {
        console.log("ℹ️ No subscriptions found (404)");
        setEmployees([]);
      } else {
        console.error("Error details:", error?.response?.data);
      }
    }
  };

  const handleAddNewInsurance = () => {
    if (activeTab === 1) {
      setEditingEmployee(null);
      setOpenEmployee(true);
    } else if (activeTab === 2) {
      setEditingCategory(null);
      setOpenCategory(true);
    } else {
      setOpen(true);
    }
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setOpenCategory(true);
  };

  const handleCategorySuccess = async (category: any) => {
    if (!selectedInsurance?.id) return;
    
    try {
      if (editingCategory) {
        await MedicalInsuranceApi.categories.update(
          selectedInsurance.id,
          editingCategory.id,
          category
        );
      } else {
        await MedicalInsuranceApi.categories.create(selectedInsurance.id, category);
      }
      await fetchCategories();
      setOpenCategory(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleEmployeeSuccess = async () => {
    // Refresh employee list after successful save
    await fetchEmployees();
    setOpenEmployee(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      await MedicalInsuranceApi.subscriptions.delete(employeeId);
      toast.success(t("deleteSuccess"));
      await fetchEmployees();
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      toast.error(t("deleteError"));
    }
  };

  const handleEditEmployee = (employee: any) => {
    setEditingEmployee(employee);
    setOpenEmployee(true);
  };

  const handleSuccess = async () => {
    await fetchInsurances();
    setOpen(false);
    // Auto-select the newly added insurance if it's the first one
    if (insurances.length === 0) {
      setTimeout(() => {
        if (insurances.length > 0) {
          setSelectedInsurance(insurances[0]);
          setActiveTab(0);
        }
      }, 500);
    }
  };

  const handleInsuranceSelect = (insurance: MedicalInsuranceRow | null) => {
    console.log("🎯 Selected Insurance:", insurance);
    console.log("🎯 Current activeTab:", activeTab);
    setSelectedInsurance(insurance);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log("🔄 Tab changed to:", newValue);
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
      {/* Header */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: 2 }}>
        {console.log("🔍 Render - selectedInsurance:", selectedInsurance, "activeTab:", activeTab)}
        {!selectedInsurance && (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              className="flex-1"
              placeholder="البحث عن التأمينات"
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button onClick={handleAddNewInsurance}>
              <Plus className="h-4 w-4 mr-2" />
              {t("addNewInsurance")}
            </Button>
          </Box>
        )}
        {selectedInsurance && activeTab === 1 && (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              className="flex-1"
              placeholder="البحث عن الموظفين"
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button onClick={handleAddNewInsurance}>
              <Plus className="h-4 w-4 mr-2" />
              إضافة موظف
            </Button>
          </Box>
        )}
        {selectedInsurance && activeTab === 2 && (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              className="flex-1"
              placeholder="البحث عن الفئات"
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="outlined" size="small" sx={{ borderColor: "red", color: "text.primary" }}>
              الكل
            </Button>
            <Button variant="outlined" size="small" sx={{ borderColor: "red", color: "text.primary" }}>
              الفئة A
            </Button>
            <Button variant="outlined" size="small" sx={{ borderColor: "red", color: "text.primary" }}>
              الفئة B
            </Button>
            <Button onClick={handleAddNewInsurance}>
              <Plus className="h-4 w-4 mr-2" />
              {t("addCategory")}
            </Button>
          </Box>
        )}
      </Box>

      {/* Main content with side-by-side layout */}
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <Box sx={{ display: "flex", flex: 1, overflow: "hidden", px: 2, gap: 2 }}>
          <AllInsurancesTable 
            onInsuranceSelect={handleInsuranceSelect} 
            onTabChange={handleTabChange}
            selectedInsurance={selectedInsurance} 
            onPaginationChange={setPaginationData}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            currentTab={activeTab}
          />
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {/* Tabs */}
            {selectedInsurance && (
              <Box sx={{ borderBottom: 1, borderColor: 'divider', borderBottomStyle: 'solid' }}>
                <Tabs value={activeTab ?? 0} onChange={handleTabChange} sx={{ width: '100%' }}>
                  <Tab label={t("policyData")} sx={{ flex: 1 }} />
                  <Tab label={t("policyEmployees")} sx={{ flex: 1 }} />
                  <Tab label={t("policyCategories")} sx={{ flex: 1 }} />
                </Tabs>
              </Box>
            )}
            <InsuranceTable selectedInsurance={selectedInsurance} activeTab={activeTab} onInsuranceSelect={handleInsuranceSelect} onTabChange={handleTabChange} categories={categories} onEditCategory={handleEditCategory} onEditEmployee={handleEditEmployee} employees={employees} onDeleteEmployee={handleDeleteEmployee} />
          </Box>
        </Box>

        {/* Pagination at bottom */}
        {paginationData.total > 0 && (
          <Box sx={{ 
            py: 2, 
            borderTop: "1px solid", 
            borderColor: "divider",
            display: "flex",
            justifyContent: "center"
          }}>
            <Pagination
              currentPage={currentPage}
              totalPages={paginationData.totalPages}
              onPageChange={setCurrentPage}
              currentLimit={itemsPerPage}
              limitOptions={[5, 10, 25, 50]}
              onLimitChange={(newLimit) => {
                setItemsPerPage(newLimit);
                setCurrentPage(1);
              }}
            />
          </Box>
        )}
      </Box>

      {/* Dialog */}
      <AddNewPolicyDialog
        open={open}
        onOpenChange={setOpen}
        editingInsurance={editingInsurance}
        onSuccess={handleSuccess}
      />

      {/* Category Dialog */}
      <AddCategoryDialog
        open={openCategory}
        onOpenChange={setOpenCategory}
        onSuccess={handleCategorySuccess}
        editingCategory={editingCategory}
      />

      {/* Employee Dialog */}
      <AddEmployeeDialog
        open={openEmployee}
        onOpenChange={setOpenEmployee}
        onSuccess={handleEmployeeSuccess}
        editingEmployee={editingEmployee}
        selectedInsuranceId={selectedInsurance?.id}
      />
    </Box>
  );
}

// Main component that provides the context
export default function MedicalInsuranceView() {
  return (
    <InsuranceProvider>
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <InsuranceContent />
      </Box>
    </InsuranceProvider>
  );
}
