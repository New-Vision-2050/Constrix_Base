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

  const fetchInsurances = async () => {
    try {
      const response = await MedicalInsuranceApi.list();
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
    if (!selectedInsurance?.id) return;
    try {
      const response = await MedicalInsuranceApi.employees.list(selectedInsurance.id, {
        page: 1,
        per_page: 100,
      });
      setEmployees(response.data.payload || []);
    } catch (error: any) {
      // If 404, it means no employees exist yet - that's okay
      if (error?.response?.status === 404) {
        setEmployees([]);
      } else {
        console.error("Error fetching employees:", error);
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

  const handleEmployeeSuccess = async (employee: any) => {
    if (!selectedInsurance?.id) return;

    console.log("📤 Sending employee data to API:", employee);
    console.log("📤 Insurance ID:", selectedInsurance.id);

    try {
      if (editingEmployee) {
        await MedicalInsuranceApi.employees.update(
          selectedInsurance.id,
          editingEmployee.id,
          employee
        );
      } else {
        await MedicalInsuranceApi.employees.create(selectedInsurance.id, employee);
      }
      await fetchEmployees();
      setOpenEmployee(false);
      setEditingEmployee(null);
    } catch (error: any) {
      console.error("Error saving employee:", error);
      console.error("Error response:", error?.response?.data);
      console.error("Error status:", error?.response?.status);

      // إضافة الموظف محلياً في حالة فشل الـ API
      if (!editingEmployee) {
        const newEmployee = {
          id: Date.now().toString(),
          name: employee.name,
          policyId: employee.policyId,
          value: employee.value,
          subscriberId: employee.subscriberId,
          dependents: employee.dependents || [],
          category: "فئة A",
        };
        setEmployees([...employees, newEmployee]);
        toast.success("تم إضافة الموظف محلياً (الـ API غير متاح)");
      }
      setOpenEmployee(false);
      setEditingEmployee(null);
    }
  };

  const handleEditEmployee = (employee: any) => {
    setEditingEmployee(employee);
    setOpenEmployee(true);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(employees.filter(emp => emp.id !== employeeId));
    toast.success("تم حذف الموظف بنجاح");
  };

  const handleSuccess = () => {
    fetchInsurances();
    setOpen(false);
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
        {selectedInsurance && (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              className="flex-1"
              placeholder={activeTab === 1 ? "البحث عن الموظفين" : activeTab === 2 ? "البحث عن الفئات" : ""}
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
            {activeTab === 2 && (
              <>
                <Button variant="outlined" size="small" sx={{ borderColor: "red", color: "text.primary" }}>
                  الكل
                </Button>
                <Button variant="outlined" size="small" sx={{ borderColor: "red", color: "text.primary" }}>
                  الفئة A
                </Button>
                <Button variant="outlined" size="small" sx={{ borderColor: "red", color: "text.primary" }}>
                  الفئة B
                </Button>
              </>
            )}
            <Button onClick={handleAddNewInsurance}>
              <Plus className="h-4 w-4 mr-2" />
              {activeTab === 1 ? "إضافة موظف" : activeTab === 2 ? t("addCategory") : t("addNewInsurance")}
            </Button>
          </Box>
        )}
      </Box>

      {/* Main content with side-by-side layout */}
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <Box sx={{ display: "flex", flex: 1, overflow: "hidden", px: 2, gap: 2 }}>
          <AllInsurancesTable 
            onInsuranceSelect={handleInsuranceSelect} 
            selectedInsurance={selectedInsurance} 
            onPaginationChange={setPaginationData}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
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
