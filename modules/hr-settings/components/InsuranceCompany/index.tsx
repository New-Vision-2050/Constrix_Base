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
import {CategoryApi} from "./services/categoryApi";

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

  const {insurances, setInsurances} = useInsurance();

  // Fetch insurances on component mount
  useEffect(() => {
    fetchInsurances();
    fetchCategories();
  }, []);

  const fetchInsurances = async () => {
    try {
      const response = await MedicalInsuranceApi.list();
      setInsurances(response.data.payload || []);
    } catch (error) {
      console.error("Error fetching insurances:", error);
    }
  };

  const fetchCategories = () => {
    try {
      const response = CategoryApi.list();
      setCategories(response.data.payload || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
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

  const handleCategorySuccess = (category: any) => {
    try {
      if (editingCategory) {
        CategoryApi.update(editingCategory.id, category);
      } else {
        CategoryApi.create(category);
      }
      fetchCategories();
      setOpenCategory(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleEmployeeSuccess = (employee: any) => {
    try {
      // TODO: Implement API call for creating/updating employee
      console.log("Saving employee:", employee);
      setOpenEmployee(false);
      setEditingEmployee(null);
    } catch (error) {
      console.error("Error saving employee:", error);
    }
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
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            className="flex-1"
            placeholder={activeTab === 1 ? "البحث عن الموظفين" : activeTab === 2 ? "البحث عن الفئات" : "البحث عن البوليصة"}
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
      </Box>

      {/* Main content with side-by-side layout */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden", px: 2, gap: 2 }}>
        <AllInsurancesTable onInsuranceSelect={handleInsuranceSelect} selectedInsurance={selectedInsurance} />
        <InsuranceTable selectedInsurance={selectedInsurance} activeTab={activeTab} onInsuranceSelect={handleInsuranceSelect} onTabChange={handleTabChange} categories={categories} onEditCategory={handleEditCategory} />
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
