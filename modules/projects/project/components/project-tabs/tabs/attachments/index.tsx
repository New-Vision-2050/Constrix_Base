"use client";

import { useMemo } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { Download, File } from "lucide-react";
import HeadlessTableLayout from "@/components/headless/table";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { AttachmentSetting } from "@/services/api/all-projects/types/response";

// ============================================================================
// Types
// ============================================================================

interface AttachmentRow {
  id: string;
  name: string;
  type: string;
  size: string;
  creator: string;
  createdAt: string;
  lastUpdated: string;
}

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_CONTRACT_ATTACHMENTS: AttachmentRow[] = [
  {
    id: "1",
    name: "انشاءات_محلية",
    type: "PDF",
    size: "17.3MB",
    creator: "مصطفى رضوان",
    createdAt: "05/08/2024",
    lastUpdated: "05/08/2024 08:30م",
  },
  {
    id: "2",
    name: "انشاءات_محلية",
    type: "PDF",
    size: "17.3MB",
    creator: "مصطفى رضوان",
    createdAt: "05/08/2024",
    lastUpdated: "05/08/2024 08:30م",
  },
];

const MOCK_TERMS_ATTACHMENTS: AttachmentRow[] = [
  {
    id: "1",
    name: "انشاءات_محلية",
    type: "PDF",
    size: "17.3MB",
    creator: "مصطفى رضوان",
    createdAt: "05/08/2024",
    lastUpdated: "05/08/2024 08:30م",
  },
  {
    id: "2",
    name: "انشاءات_محلية",
    type: "PDF",
    size: "17.3MB",
    creator: "مصطفى رضوان",
    createdAt: "05/08/2024",
    lastUpdated: "05/08/2024 08:30م",
  },
];

const DEFAULT_SETTING: AttachmentSetting = {
  id: 0,
  project_type_id: 0,
  is_name: 1,
  is_type: 1,
  is_size: 1,
  is_creator: 1,
  is_create_date: 1,
  is_downloadable: 1,
  created_at: "",
  updated_at: "",
};

// ============================================================================
// Table Instances (unique keys per section)
// ============================================================================

const ContractTableLayout = HeadlessTableLayout<AttachmentRow>(
  "contract-attachments",
);
const TermsTableLayout =
  HeadlessTableLayout<AttachmentRow>("terms-attachments");

// ============================================================================
// Helpers
// ============================================================================

function allZero(s: AttachmentSetting): boolean {
  return (
    s.is_name === 0 &&
    s.is_type === 0 &&
    s.is_size === 0 &&
    s.is_creator === 0 &&
    s.is_create_date === 0 &&
    s.is_downloadable === 0
  );
}

function buildColumns(setting: AttachmentSetting) {
  const cols: {
    key: string;
    name: string;
    sortable: boolean;
    render: (row: AttachmentRow) => React.ReactNode;
  }[] = [];

  if (setting.is_name === 1) {
    cols.push({
      key: "name",
      name: "اسم الملف",
      sortable: false,
      render: (row) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <File className="w-4 h-4" style={{ flexShrink: 0 }} />
          <span>{row.name}</span>
        </Box>
      ),
    });
  }

  if (setting.is_type === 1) {
    cols.push({
      key: "type",
      name: "النوع",
      sortable: false,
      render: (row) => <span>{row.type}</span>,
    });
  }

  if (setting.is_size === 1) {
    cols.push({
      key: "size",
      name: "الحجم",
      sortable: false,
      render: (row) => <span>{row.size}</span>,
    });
  }

  if (setting.is_creator === 1) {
    cols.push({
      key: "creator",
      name: "المنشئ",
      sortable: false,
      render: (row) => <span>{row.creator}</span>,
    });
  }

  if (setting.is_create_date === 1) {
    cols.push({
      key: "createdAt",
      name: "تاريخ الانشاء",
      sortable: false,
      render: (row) => <span>{row.createdAt}</span>,
    });
  }

  if (setting.is_downloadable === 1) {
    cols.push({
      key: "download",
      name: "التحميل",
      sortable: false,
      render: () => (
        <IconButton size="small">
          <Download className="w-4 h-4" />
        </IconButton>
      ),
    });
  }

  return cols;
}

// ============================================================================
// Attachment Section
// ============================================================================

interface AttachmentSectionProps {
  title: string;
  lastUpdated: string;
  Layout: typeof ContractTableLayout;
  data: AttachmentRow[];
  setting: AttachmentSetting;
}

function AttachmentSection({
  title,
  lastUpdated,
  Layout,
  data,
  setting,
}: AttachmentSectionProps) {
  const columns = useMemo(() => buildColumns(setting), [setting]);

  const params = Layout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const state = Layout.useTableState({
    data,
    columns,
    totalPages: 1,
    totalItems: data.length,
    params,
    getRowId: (row: AttachmentRow) => row.id,
    loading: false,
  });

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
          px: 1,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          آخر تحديث : {lastUpdated}
        </Typography>
      </Box>

      <Layout
        table={<Layout.Table state={state} loadingOptions={{ rows: 3 }} />}
        pagination={<Layout.Pagination state={state} />}
      />
    </Box>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function AttachmentsTab() {
  const { projectData } = useProject();
  const permissions = projectData?.permissions;

  const contractSetting = permissions?.attachment_contract_setting ?? null;
  const termsSetting = permissions?.attachment_terms_contract_setting ?? null;

  const effectiveContractSetting = contractSetting ?? DEFAULT_SETTING;
  const effectiveTermsSetting = termsSetting ?? DEFAULT_SETTING;

  const showContractSection = !contractSetting || !allZero(contractSetting);
  const showTermsSection = !termsSetting || !allZero(termsSetting);
  const nothingToShow =
    contractSetting &&
    termsSetting &&
    !showContractSection &&
    !showTermsSection;

  const contractLastUpdated = MOCK_CONTRACT_ATTACHMENTS[0]?.lastUpdated ?? "";
  const termsLastUpdated = MOCK_TERMS_ATTACHMENTS[0]?.lastUpdated ?? "";

  return (
    <Box sx={{ p: 3 }}>
      {/* ── Action Buttons ──────────────────────────────────────── */}
      <Box
        sx={{ display: "flex", gap: 1.5, mb: 3, justifyContent: "flex-end" }}
      >
        <Button variant="contained" color="primary" sx={{ fontWeight: "bold" }}>
          اضافة مرفق
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Download className="w-4 h-4" />}
          sx={{ fontWeight: "bold" }}
        >
          تحميل جميع المرفقات
        </Button>
      </Box>

      {/* ── Contract Attachments ─────────────────────────────────── */}
      {showContractSection && (
        <AttachmentSection
          title="مرفقات العقود"
          lastUpdated={contractLastUpdated}
          Layout={ContractTableLayout}
          data={MOCK_CONTRACT_ATTACHMENTS}
          setting={effectiveContractSetting}
        />
      )}

      {/* ── Terms Attachments ────────────────────────────────────── */}
      {showTermsSection && (
        <AttachmentSection
          title="مرفقات البنود"
          lastUpdated={termsLastUpdated}
          Layout={TermsTableLayout}
          data={MOCK_TERMS_ATTACHMENTS}
          setting={effectiveTermsSetting}
        />
      )}

      {/* ── Empty State ──────────────────────────────────────────── */}
      {nothingToShow && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography color="text.secondary">لا توجد مرفقات متاحة</Typography>
        </Box>
      )}
    </Box>
  );
}
