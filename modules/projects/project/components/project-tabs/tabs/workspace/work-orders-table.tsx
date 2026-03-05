"use client";

import { useMemo } from "react";
import { Box, Button, Chip, MenuItem, Typography } from "@mui/material";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import {  EditIcon } from "lucide-react";

export interface WorkOrder {
  id: string;
  orderNumber: string;
  orderType: string;
  contractor: string;
  location: string;
  lastAction: string;
  actionTaken: string;
  currentAction: number;
}

const actionStatusColors: Record<string, { bg: string; color: string }> = {
  تنفيذ: { bg: "#2e7d32", color: "#fff" },
  "تغيير موعد": { bg: "#f9a825", color: "#fff" },
  "طلب تحويل": { bg: "#2e7d32", color: "#fff" },
  تأخير: { bg: "#c62828", color: "#fff" },
};

const MOCK_WORK_ORDERS: WorkOrder[] = [
  {
    id: "1",
    orderNumber: "25443211",
    orderType: "401",
    contractor: "خالد سعيد",
    location: "جدة",
    lastAction: "تركيب",
    actionTaken: "تنفيذ",
    currentAction: 145,
  },
  {
    id: "2",
    orderNumber: "25443211",
    orderType: "401",
    contractor: "خالد سعيد",
    location: "جدة",
    lastAction: "تركيب",
    actionTaken: "تغيير موعد",
    currentAction: 145,
  },
  {
    id: "3",
    orderNumber: "25443211",
    orderType: "401",
    contractor: "خالد سعيد",
    location: "جدة",
    lastAction: "تركيب",
    actionTaken: "طلب تحويل",
    currentAction: 145,
  },
  {
    id: "4",
    orderNumber: "25443211",
    orderType: "401",
    contractor: "خالد سعيد",
    location: "جدة",
    lastAction: "تركيب",
    actionTaken: "تأخير",
    currentAction: 145,
  },
  {
    id: "5",
    orderNumber: "25443211",
    orderType: "401",
    contractor: "خالد سعيد",
    location: "جدة",
    lastAction: "تركيب",
    actionTaken: "تنفيذ",
    currentAction: 145,
  },
];

const WorkOrdersTableLayout = HeadlessTableLayout<WorkOrder>("ws-work-orders");

const getWorkOrderColumns = () => [
  {
    key: "orderNumber",
    name: "رقم امر العمل",
    sortable: false,
    render: (row: WorkOrder) => <span>{row.orderNumber}</span>,
  },
  {
    key: "orderType",
    name: "نوع امر العمل",
    sortable: false,
    render: (row: WorkOrder) => <span>{row.orderType}</span>,
  },
  {
    key: "contractor",
    name: "المقاول",
    sortable: false,
    render: (row: WorkOrder) => <span>{row.contractor}</span>,
  },
  {
    key: "location",
    name: "الموقع",
    sortable: false,
    render: (row: WorkOrder) => <span>{row.location}</span>,
  },
  {
    key: "lastAction",
    name: "آخر اجراء",
    sortable: false,
    render: (row: WorkOrder) => <span>{row.lastAction}</span>,
  },
  {
    key: "actionTaken",
    name: "اتخاذ اجراء",
    sortable: false,
    render: (row: WorkOrder) => {
      const colors = actionStatusColors[row.actionTaken] || {
        bg: "#757575",
        color: "#fff",
      };
      return (
        <Chip
          label={row.actionTaken}
          size="small"
          sx={{
            backgroundColor: colors.bg,
            color: colors.color,
            fontWeight: "bold",
            fontSize: "0.75rem",
          }}
        />
      );
    },
  },
  {
    key: "currentAction",
    name: "الاجراء الحالي",
    sortable: false,
    render: (row: WorkOrder) => <span>{row.currentAction}</span>,
  },
];

export default function WorkOrdersTable() {
  const params = WorkOrdersTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const data = useMemo(() => MOCK_WORK_ORDERS, []);
  const totalPages = 3;
  const totalItems = MOCK_WORK_ORDERS.length;

  const columns = [
    ...getWorkOrderColumns(),
    {
      key: "actions",
      name: "الاعدادات",
      sortable: false,
      render: () => (
         <CustomMenu
          renderAnchor={({ onClick }) => (
            <Button  size="small" variant="contained" color="info" onClick={onClick}>الاجراءات</Button>
          )}
        >
          <MenuItem
            onClick={() => {}}
          >
            <EditIcon className="w-4 h-4 ml-2" />
            تعديل
          </MenuItem>
        </CustomMenu>
      ),
    },
  ];

  const state = WorkOrdersTableLayout.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    getRowId: (row: WorkOrder) => row.id,
    loading: false,
  });

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        أوامر العمل
      </Typography>
      <WorkOrdersTableLayout
        filters={
          <WorkOrdersTableLayout.TopActions state={state} >
          </WorkOrdersTableLayout.TopActions>
        }
        table={
          <WorkOrdersTableLayout.Table
            state={state}
            loadingOptions={{ rows: 5 }}
          />
        }
        pagination={<WorkOrdersTableLayout.Pagination state={state} />}
      />
    </Box>
  );
}

