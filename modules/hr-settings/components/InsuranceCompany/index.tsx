"use client";

import {useTranslations} from "next-intl";
import {useState, useEffect} from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import AddNewPolicyDialog from "./AddNewPolicyDialog";
import {Typography, Tabs, Tab} from "@mui/material";
import {Box} from "@mui/material";
import {InsuranceProvider, useInsurance} from "./context/InsuranceContext";
import AllInsurancesTable from "./components/AllInsurancesTable";
import InsuranceTable from "./components/InsuranceTable";
import {MedicalInsuranceApi} from "@/services/api/medical-insurance";
import {MedicalInsuranceRow} from "./types";

function InsuranceContent() {
  const t = useTranslations("hr-settings.insurance");
  const [open, setOpen] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState(null);
  const [selectedInsurance, setSelectedInsurance] = useState<MedicalInsuranceRow | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  
  const {insurances, setInsurances} = useInsurance();

  // Fetch insurances on component mount
  useEffect(() => {
    fetchInsurances();
  }, []);

  const fetchInsurances = async () => {
    try {
      const response = await MedicalInsuranceApi.list();
      setInsurances(response.data.payload || []);
    } catch (error) {
      console.error("Error fetching insurances:", error);
    }
  };

  const handleAddNewInsurance = () => {
    setOpen(true);
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
            placeholder={t("search")}
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
        <InsuranceTable selectedInsurance={selectedInsurance} activeTab={activeTab} onInsuranceSelect={handleInsuranceSelect} onTabChange={handleTabChange} />
      </Box>

      {/* Dialog */}
      <AddNewPolicyDialog
        open={open}
        onOpenChange={setOpen}
        editingInsurance={editingInsurance}
        onSuccess={handleSuccess}
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
