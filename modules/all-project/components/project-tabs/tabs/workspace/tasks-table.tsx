"use client";

import { useMemo } from "react";
import { Box, Button, MenuItem, Typography } from "@mui/material";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import { ChevronDown, EditIcon, SendIcon } from "lucide-react";

export interface Task {
  id: string;
  date: string;
  ordersCount: number;
  accepted: number;
  rejected: number;
  status: string;
  number: number;
}

const taskStatusColors: Record<string, string> = {
  مباري: "text-green-500",
  مقبول: "text-gray-400",
  مرفوض: "text-red-500",
};

const MOCK_TASKS: Task[] = [
  {
    id: "1",
    date: "السبت 29/05/2024",
    ordersCount: 8,
    accepted: 9,
    rejected: 7,
    status: "مباري",
    number: 145,
  },
  {
    id: "2",
    date: "الجمعة 28/05/2024",
    ordersCount: 1,
    accepted: 2,
    rejected: 5,
    status: "مقبول",
    number: 142,
  },
  {
    id: "3",
    date: "الخميس 27/05/2024",
    ordersCount: 8,
    accepted: 0,
    rejected: 2,
    status: "مرفوض",
    number: 140,
  },
  {
    id: "4",
    date: "الاربعاء 26/05/2024",
    ordersCount: 1,
    accepted: 2,
    rejected: 5,
    status: "مقبول",
    number: 142,
  },
  {
    id: "5",
    date: "الثلاثاء 25/05/2024",
    ordersCount: 9,
    accepted: 7,
    rejected: 5,
    status: "مقبول",
    number: 145,
  },
];

const TasksTableLayout = HeadlessTableLayout<Task>("ws-tasks");

const getTaskColumns = () => [
  {
    key: "date",
    name: "التاريخ",
    sortable: false,
    render: (row: Task) => <span>{row.date}</span>,
  },
  {
    key: "ordersCount",
    name: "عدد الأوامر",
    sortable: false,
    render: (row: Task) => <span>{row.ordersCount}</span>,
  },
  {
    key: "accepted",
    name: "المقبول",
    sortable: false,
    render: (row: Task) => <span>{row.accepted}</span>,
  },
  {
    key: "rejected",
    name: "المرفوض",
    sortable: false,
    render: (row: Task) => <span>{row.rejected}</span>,
  },
  {
    key: "status",
    name: "الحالة",
    sortable: false,
    render: (row: Task) => {
      const colorClass = taskStatusColors[row.status] || "text-gray-400";
      return <span className={`font-bold ${colorClass}`}>{row.status}</span>;
    },
  },
  {
    key: "number",
    name: "الرقم",
    sortable: false,
    render: (row: Task) => <span>{row.number}</span>,
  },
];

export default function TasksTable() {
  const params = TasksTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const data = useMemo(() => MOCK_TASKS, []);
  const totalPages = 3;
  const totalItems = MOCK_TASKS.length;

  const columns = [
    ...getTaskColumns(),
    {
      key: "actions",
      name: "الاعدادات",
      sortable: false,
      render: () => (
        <CustomMenu
          renderAnchor={({ onClick }) => (
            <Button size="small" variant="contained" color="info" onClick={onClick}>الاجراءات</Button>
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

  const state = TasksTableLayout.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: Task) => row.id,
    loading: false,
    searchable: false,
  });

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        المهام
      </Typography>
      <TasksTableLayout
        filters={
          <TasksTableLayout.TopActions state={state} customActions={
          <Box sx={{ display: "flex", gap: 1 }}>
           <CustomMenu
          renderAnchor={({ onClick }) => (
            <Button size="small" variant="contained" endIcon={<ChevronDown className="w-4 h-4 " />} onClick={onClick}>انشاء</Button>
          )}
        >
          <MenuItem
            onClick={() => {}}
          >
            <SendIcon className="w-4 h-4 ml-2" />
            ارسال الي
          </MenuItem>
          <MenuItem
            onClick={() => {}}
          >
            <SendIcon className="w-4 h-4 ml-2" />
            ارسال يدويا
          </MenuItem>
        </CustomMenu>
          <Button size="small" variant="contained" onClick={() => {}}>الوارد</Button>
          </Box>}>
      
          </TasksTableLayout.TopActions>
        }
        table={
          <TasksTableLayout.Table
            state={state}
            loadingOptions={{ rows: 5 }}
          />
        }
        pagination={<TasksTableLayout.Pagination state={state} />}
      />
    </Box>
  );
}

