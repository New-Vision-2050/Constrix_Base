"use client";

import { useMemo } from "react";
import { Box, Button, Chip, MenuItem } from "@mui/material";
import { ChevronDown, EditIcon, MapPin } from "lucide-react";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";

// ============================================================================
// Types
// ============================================================================

interface WorkOrderAttachment {
  id: string;
  orderNumber: string;
  orderType: string;
  assignDate: string;
  contractor: string;
  district: string;
  duration: string;
  location: string;
  status: string;
  consultancyOrder: string;
  section: string;
  estimatedCost: number;
  lastAction: string;
  lastActionDate: string;
}

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_DATA: WorkOrderAttachment[] = [
  {
    id: "1",
    orderNumber: "12345678",
    orderType: "802",
    assignDate: "18/03/2024",
    contractor: "شركة الغرابلي",
    district: "السلامة",
    duration: "5 ايام",
    location: "الموقع",
    status: "جاري",
    consultancyOrder: "913",
    section: "قسم مكة",
    estimatedCost: 2791,
    lastAction: "195",
    lastActionDate: "18/03/2024",
  },
  {
    id: "2",
    orderNumber: "12345678",
    orderType: "802",
    assignDate: "18/03/2024",
    contractor: "شركة الغرابلي",
    district: "السلامة",
    duration: "5 ايام",
    location: "الموقع",
    status: "جاري",
    consultancyOrder: "913",
    section: "قسم مكة",
    estimatedCost: 2791,
    lastAction: "195",
    lastActionDate: "18/03/2024",
  },
  {
    id: "3",
    orderNumber: "12345678",
    orderType: "802",
    assignDate: "18/03/2024",
    contractor: "شركة الغرابلي",
    district: "السلامة",
    duration: "5 ايام",
    location: "الموقع",
    status: "جاري",
    consultancyOrder: "913",
    section: "قسم مكة",
    estimatedCost: 2791,
    lastAction: "195",
    lastActionDate: "18/03/2024",
  },
  {
    id: "4",
    orderNumber: "12345678",
    orderType: "802",
    assignDate: "18/03/2024",
    contractor: "شركة الغرابلي",
    district: "السلامة",
    duration: "5 ايام",
    location: "الموقع",
    status: "جاري",
    consultancyOrder: "913",
    section: "قسم مكة",
    estimatedCost: 2791,
    lastAction: "195",
    lastActionDate: "18/03/2024",
  },
  {
    id: "5",
    orderNumber: "12345678",
    orderType: "802",
    assignDate: "18/03/2024",
    contractor: "شركة الغرابلي",
    district: "السلامة",
    duration: "5 ايام",
    location: "الموقع",
    status: "جاري",
    consultancyOrder: "913",
    section: "قسم مكة",
    estimatedCost: 2791,
    lastAction: "195",
    lastActionDate: "18/03/2024",
  },
];

// ============================================================================
// Table Instance
// ============================================================================

const AttachmentsTableLayout =
  HeadlessTableLayout<WorkOrderAttachment>("attachments");

// ============================================================================
// Column Definitions
// ============================================================================

const getColumns = () => [
  {
    key: "orderNumber",
    name: "رقم امر العمل",
    sortable: false,
    render: (row: WorkOrderAttachment) => <span>{row.orderNumber}</span>,
  },
  {
    key: "orderType",
    name: "نوع امر العمل",
    sortable: false,
    render: (row: WorkOrderAttachment) => <span>{row.orderType}</span>,
  },
  {
    key: "assignDate",
    name: "تاريخ الاسناد",
    sortable: false,
    render: (row: WorkOrderAttachment) => <span>{row.assignDate}</span>,
  },
  {
    key: "contractor",
    name: "اسم المقاول",
    sortable: false,
    render: (row: WorkOrderAttachment) => <span>{row.contractor}</span>,
  },
  {
    key: "district",
    name: "الحي",
    sortable: false,
    render: (row: WorkOrderAttachment) => <span>{row.district}</span>,
  },
  {
    key: "duration",
    name: "مدة التنفيذ",
    sortable: false,
    render: (row: WorkOrderAttachment) => <span>{row.duration}</span>,
  },
  {
    key: "location",
    name: "الموقع",
    sortable: false,
    render: () => <MapPin className="w-5 h-5" style={{ color: "#f59e0b" }} />,
  },
  {
    key: "status",
    name: "حالة امر العمل",
    sortable: false,
    render: (row: WorkOrderAttachment) => (
      <Chip
        label={row.status}
        size="small"
        sx={{
          backgroundColor: "#16a34a",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "0.75rem",
        }}
      />
    ),
  },
  {
    key: "consultancyOrder",
    name: "امر عمل استشاري",
    sortable: false,
    render: (row: WorkOrderAttachment) => <span>{row.consultancyOrder}</span>,
  },
  {
    key: "section",
    name: "القسم",
    sortable: false,
    render: (row: WorkOrderAttachment) => <span>{row.section}</span>,
  },
  {
    key: "estimatedCost",
    name: "التكلفة التقديرية",
    sortable: false,
    render: (row: WorkOrderAttachment) => (
      <span className="flex items-center gap-1">
        <ChevronDown className="w-4 h-4 text-green-500" />
        {row.estimatedCost.toLocaleString()}
      </span>
    ),
  },
  {
    key: "lastAction",
    name: "اخر اجراء",
    sortable: false,
    render: (row: WorkOrderAttachment) => <span>{row.lastAction}</span>,
  },
  {
    key: "lastActionDate",
    name: "تاريخ اخر اجراء",
    sortable: false,
    render: (row: WorkOrderAttachment) => <span>{row.lastActionDate}</span>,
  },
];

// ============================================================================
// Component
// ============================================================================

export default function AttachmentsTab() {
  const params = AttachmentsTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const data = useMemo(() => MOCK_DATA, []);
  const totalPages = 3;
  const totalItems = 13;

  const columns = [
    ...getColumns(),
    {
      key: "actions",
      name: "خيارات",
      sortable: false,
      render: () => (
        <CustomMenu
          renderAnchor={({ onClick }) => (
            <Button
              size="small"
              variant="contained"
              color="inherit"
              endIcon={<ChevronDown className="w-4 h-4" />}
              onClick={onClick}
              sx={{ backgroundColor: "#3f3f5a", color: "#fff" }}
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

  const state = AttachmentsTableLayout.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: WorkOrderAttachment) => row.id,
    loading: false,
    searchable: true,
    onExport: async () => {
      // TODO: implement export
    },
  });

  return (
    <Box sx={{ p: 3 }}>
      <AttachmentsTableLayout
        filters={
          <AttachmentsTableLayout.TopActions
            state={state}
            customActions={
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button variant="contained" color="primary" onClick={() => {}}>
                  ارفاق ملفات
                </Button>
                <Button variant="outlined" onClick={() => {}}>
                  تحميل جميع المرفقات
                </Button>
              </Box>
            }
          />
        }
        table={
          <AttachmentsTableLayout.Table
            state={state}
            loadingOptions={{ rows: 5 }}
          />
        }
        pagination={<AttachmentsTableLayout.Pagination state={state} />}
      />
    </Box>
  );
}
