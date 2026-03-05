"use client";

import { useMemo } from "react";
import { Box, Button, MenuItem } from "@mui/material";
import { EditIcon, FileSpreadsheet, FileText, FileIcon } from "lucide-react";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";

// ============================================================================
// Types
// ============================================================================

interface Contractor {
  id: string;
  name: string;
  commercialRegister: string;
  email: string;
  phone: string;
  projectManager: string;
  projectManagerPhone: string;
  attachments: string[];
}

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_CONTRACTORS: Contractor[] = [
  {
    id: "1",
    name: "الهاجدية",
    commercialRegister: "تطوير منطقة التي..",
    email: "susanna.Lind57@gmail.com",
    phone: "+996 57387211",
    projectManager: "احمد حسن",
    projectManagerPhone: "+996 57387211",
    attachments: ["excel", "pdf", "word"],
  },
  {
    id: "2",
    name: "الهاجدية",
    commercialRegister: "تطوير منطقة التي..",
    email: "susanna.Lind57@gmail.com",
    phone: "+996 57387211",
    projectManager: "احمد حسن",
    projectManagerPhone: "+996 57387211",
    attachments: ["excel", "pdf", "word"],
  },
  {
    id: "3",
    name: "الهاجدية",
    commercialRegister: "تطوير منطقة التي..",
    email: "susanna.Lind57@gmail.com",
    phone: "+996 57387211",
    projectManager: "احمد حسن",
    projectManagerPhone: "+996 57387211",
    attachments: ["excel", "pdf", "word"],
  },
];

// ============================================================================
// Table Instance
// ============================================================================

const ContractorsTableLayout = HeadlessTableLayout<Contractor>("contractors");

// ============================================================================
// Attachment Icon Helper
// ============================================================================

function AttachmentIcons({ attachments }: { attachments: string[] }) {
  return (
    <Box sx={{ display: "flex", gap: 0.5 }}>
      {attachments.map((type, idx) => {
        switch (type) {
          case "excel":
            return (
              <FileSpreadsheet
                key={idx}
                className="w-5 h-5 text-green-500"
              />
            );
          case "pdf":
            return (
              <FileText key={idx} className="w-5 h-5 text-red-500" />
            );
          case "word":
            return (
              <FileIcon key={idx} className="w-5 h-5 text-blue-500" />
            );
          default:
            return (
              <FileIcon key={idx} className="w-5 h-5 text-gray-400" />
            );
        }
      })}
    </Box>
  );
}

// ============================================================================
// Column Definitions
// ============================================================================

const getContractorColumns = () => [
  {
    key: "name",
    name: "اسم المقاول",
    sortable: false,
    render: (row: Contractor) => <span>{row.name}</span>,
  },
  {
    key: "commercialRegister",
    name: "السجل التجاري",
    sortable: false,
    render: (row: Contractor) => <span>{row.commercialRegister}</span>,
  },
  {
    key: "email",
    name: "البريد الالكتروني",
    sortable: false,
    render: (row: Contractor) => <span>{row.email}</span>,
  },
  {
    key: "phone",
    name: "رقم الجوال",
    sortable: false,
    render: (row: Contractor) => <span>{row.phone}</span>,
  },
  {
    key: "projectManager",
    name: "مدير المشروع",
    sortable: false,
    render: (row: Contractor) => <span>{row.projectManager}</span>,
  },
  {
    key: "projectManagerPhone",
    name: "جوال مدير المشروع",
    sortable: false,
    render: (row: Contractor) => <span>{row.projectManagerPhone}</span>,
  },
  {
    key: "attachments",
    name: "المرفقات",
    sortable: false,
    render: (row: Contractor) => (
      <AttachmentIcons attachments={row.attachments} />
    ),
  },
];

// ============================================================================
// Component
// ============================================================================

export default function ContractorsTab() {
  // Table params
  const params = ContractorsTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const data = useMemo(() => MOCK_CONTRACTORS, []);
  const totalPages = 3;
  const totalItems = 13;

  // Columns with actions
  const columns = [
    ...getContractorColumns(),
    {
      key: "actions",
      name: "الاجراء",
      sortable: false,
      render: () => (
        <CustomMenu
          renderAnchor={({ onClick }) => (
            <Button
              size="small"
              variant="contained"
              color="info"
              onClick={onClick}
            >
              اجراء
            </Button>
          )}
        >
          <MenuItem onClick={() => {}}>
            <EditIcon className="w-4 h-4 ml-2" />
            تعديل
          </MenuItem>
        </CustomMenu>
      ),
    },
  ];

  // Table state
  const state = ContractorsTableLayout.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: Contractor) => row.id,
    loading: false,
    searchable: true,
    onExport: async () => {
      // TODO: implement export
    },
  });

  return (
    <Box sx={{ p: 3 }}>
      <ContractorsTableLayout
        filters={
          <ContractorsTableLayout.TopActions
            state={state}
            customActions={
              <Button variant="contained"  onClick={() => {}}>
                اضافة مشروع
              </Button>
            }
          >
          </ContractorsTableLayout.TopActions>
        }
        table={
          <ContractorsTableLayout.Table
            state={state}
            loadingOptions={{ rows: 5 }}
          />
        }
        pagination={<ContractorsTableLayout.Pagination state={state} />}
      />
    </Box>
  );
}
