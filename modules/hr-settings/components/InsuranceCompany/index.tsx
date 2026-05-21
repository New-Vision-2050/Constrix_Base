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

  // Update pagination data when insurances change
  useEffect(() => {
    const total = insurances.length;
    const totalPages = Math.ceil(total / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    setPaginationData({
      currentPage,
      totalPages,
      startIndex,
      endIndex,
      total,
    });
  }, [insurances, currentPage, itemsPerPage]);

  // Fetch categories and employees when selectedInsurance changes
  useEffect(() => {
    if (selectedInsurance?.id) {
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
      fetchEmployees();
    }
  }, [activeTab]);

  const fetchInsurances = async () => {
    try {
      const response = await MedicalInsuranceApi.list({
        per_page: 100, // Fetch more items
      });
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
      setCategories(response.data.payload || []);
    } catch (error: any) {
      // If 404, it means no categories exist yet - that's okay
      if (error?.response?.status === 404) {
        setCategories([]);
      } else {
        console.error("Error fetching categories:", error);
      }
    }
  };

  const fetchEmployees = async () => {
    if (!selectedInsurance?.id) {
      return;
    }
    
    try {
      const response = await MedicalInsuranceApi.subscriptions.list({
        page: 1,
        per_page: 100,
      });
      
      // Filter subscriptions for the selected insurance
      const filteredEmployees = response.data.payload.filter(
        (sub: any) => {
          // Try both policy_id and medical_insurance_id (backend may use either)
          const matches = sub.policy_id === selectedInsurance.id || sub.medical_insurance_id === selectedInsurance.id;
          return matches;
        }
      );
      
      setEmployees(filteredEmployees || []);
    } catch (error: any) {
      console.error("❌ Error fetching employees:", error);
      // If 404, it means no subscriptions exist yet - that's okay
      if (error?.response?.status === 404) {
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
    setSelectedInsurance(insurance);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
      {/* Header */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: 2 }}>
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

        {/* Pagination at bottom - only show on main page (no insurance selected) */}
        {!selectedInsurance && paginationData.total > 0 && (
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
