"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Box, Button, MenuItem, Typography } from "@mui/material";
import { EditIcon } from "lucide-react";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import { useDebouncedValue } from "@/modules/table/hooks/useDebounce";
import AddContractorDialog from "./add-contractor/AddContractorDialog";

const SEARCH_DEBOUNCE_MS = 400;

interface ContractorRow {
  id: string;
  name: string;
  type: string;
  commercialRegister: string;
  taxId: string;
  mobile: string;
  email: string;
  primaryContact: string;
  classification: string;
  status: "active" | "inactive";
}

const MOCK_CONTRACTORS: ContractorRow[] = [
  {
    id: "1",
    name: "مؤسسة المستقبل للمقاولات",
    type: "مقاول اعمال مدنية",
    commercialRegister: "4030 123 456",
    taxId: "3100 1234 5600 0003",
    mobile: "+9623658946846",
    email: "info@mostaqblconst.com",
    primaryContact: "احمد محمود الجبري",
    classification: "درجة اولى",
    status: "active",
  },
  {
    id: "2",
    name: "شركة البناء الحديث",
    type: "مقاول اعمال كهربائية",
    commercialRegister: "4030 456 789",
    taxId: "3100 5678 9100 0001",
    mobile: "+962791234567",
    email: "contact@modernbuild.com",
    primaryContact: "محمد علي السعد",
    classification: "درجة ثانية",
    status: "active",
  },
  {
    id: "3",
    name: "مؤسسة الرؤية للمقاولات",
    type: "مقاول اعمال ميكانيكية",
    commercialRegister: "4030 789 012",
    taxId: "3100 9012 3400 0005",
    mobile: "+962785551234",
    email: "info@visionconst.jo",
    primaryContact: "خالد عبدالله",
    classification: "درجة اولى",
    status: "active",
  },
  {
    id: "4",
    name: "شركة الاتحاد للإنشاءات",
    type: "مقاول اعمال مدنية",
    commercialRegister: "4030 234 567",
    taxId: "3100 3456 7800 0002",
    mobile: "+962799887766",
    email: "union@buildco.com",
    primaryContact: "سامي يوسف الحمود",
    classification: "درجة ثالثة",
    status: "inactive",
  },
  {
    id: "5",
    name: "مؤسسة النهضة للمقاولات",
    type: "مقاول تشطيبات",
    commercialRegister: "4030 345 678",
    taxId: "3100 4567 8900 0004",
    mobile: "+962788776655",
    email: "nahda@contractors.jo",
    primaryContact: "فهد سليمان العتيبي",
    classification: "درجة اولى",
    status: "active",
  },
  {
    id: "6",
    name: "شركة الجودة للمقاولات",
    type: "مقاول اعمال مدنية",
    commercialRegister: "4030 567 890",
    taxId: "3100 6789 0100 0006",
    mobile: "+962777665544",
    email: "quality@const.jo",
    primaryContact: "عمر حسين",
    classification: "درجة ثانية",
    status: "active",
  },
  {
    id: "7",
    name: "مؤسسة الأمل للإنشاء",
    type: "مقاول لاندسكيب",
    commercialRegister: "4030 678 901",
    taxId: "3100 7890 1200 0007",
    mobile: "+962766554433",
    email: "aml@landscape.jo",
    primaryContact: "ياسر محمد",
    classification: "درجة اولى",
    status: "active",
  },
  {
    id: "8",
    name: "شركة التطوير المتكامل",
    type: "مقاول اعمال كهربائية",
    commercialRegister: "4030 789 012",
    taxId: "3100 8901 2300 0008",
    mobile: "+962755443322",
    email: "dev@integrated.jo",
    primaryContact: "نادر القحطاني",
    classification: "درجة ثانية",
    status: "inactive",
  },
  {
    id: "9",
    name: "مؤسسة الخبراء للمقاولات",
    type: "مقاول اعمال ميكانيكية",
    commercialRegister: "4030 890 123",
    taxId: "3100 9012 3400 0009",
    mobile: "+962744332211",
    email: "experts@const.com",
    primaryContact: "طارق الزهراني",
    classification: "درجة اولى",
    status: "active",
  },
  {
    id: "10",
    name: "شركة الإنجاز السريع",
    type: "مقاول اعمال مدنية",
    commercialRegister: "4030 901 234",
    taxId: "3100 0123 4500 0010",
    mobile: "+962733221100",
    email: "fast@enjaz.jo",
    primaryContact: "وليد الشمري",
    classification: "درجة ثالثة",
    status: "active",
  },
  {
    id: "11",
    name: "مؤسسة الوطن للمقاولات",
    type: "مقاول تشطيبات",
    commercialRegister: "4030 012 345",
    taxId: "3100 1234 5600 0011",
    mobile: "+962722110099",
    email: "watan@build.jo",
    primaryContact: "راشد العنزي",
    classification: "درجة اولى",
    status: "active",
  },
  {
    id: "12",
    name: "شركة المستقبل للإنشاءات",
    type: "مقاول اعمال مدنية",
    commercialRegister: "4030 123 789",
    taxId: "3100 2345 6700 0012",
    mobile: "+962711009988",
    email: "future@buildco.jo",
    primaryContact: "بدر الفهد",
    classification: "درجة ثانية",
    status: "active",
  },
  {
    id: "13",
    name: "مؤسسة الريادة للمقاولات",
    type: "مقاول اعمال كهربائية",
    commercialRegister: "4030 234 890",
    taxId: "3100 3456 7800 0013",
    mobile: "+962700998877",
    email: "lead@const.jo",
    primaryContact: "ماجد الدوسري",
    classification: "درجة اولى",
    status: "active",
  },
];

function contractorStatusColor(status: ContractorRow["status"]): string {
  return status === "active" ? "success.main" : "text.secondary";
}

function filterContractors(
  rows: ContractorRow[],
  search: string,
): ContractorRow[] {
  const q = search.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((row) =>
    [
      row.name,
      row.type,
      row.commercialRegister,
      row.taxId,
      row.mobile,
      row.email,
      row.primaryContact,
      row.classification,
    ].some((value) => value.toLowerCase().includes(q)),
  );
}

const ContractorsTableLayout = HeadlessTableLayout<ContractorRow>("contractors");

export default function ContractorsTab() {
  const t = useTranslations("project.contractorsTab");
  const tTable = useTranslations("project.contractorsTab.table");
  const tStatus = useTranslations("project.contractorsTab.status");
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const params = ContractorsTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });
  const debouncedSearch = useDebouncedValue(params.search.trim(), SEARCH_DEBOUNCE_MS);

  const filteredRows = useMemo(
    () => filterContractors(MOCK_CONTRACTORS, debouncedSearch),
    [debouncedSearch],
  );

  const totalItems = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / params.limit));

  const pageData = useMemo(() => {
    const start = (params.page - 1) * params.limit;
    return filteredRows.slice(start, start + params.limit);
  }, [filteredRows, params.page, params.limit]);

  const columns = useMemo(
    () => [
      {
        key: "name",
        name: tTable("name"),
        sortable: false,
        render: (row: ContractorRow) => <span>{row.name}</span>,
      },
      {
        key: "type",
        name: tTable("type"),
        sortable: false,
        render: (row: ContractorRow) => <span>{row.type}</span>,
      },
      {
        key: "commercialRegister",
        name: tTable("commercialRegister"),
        sortable: false,
        render: (row: ContractorRow) => <span>{row.commercialRegister}</span>,
      },
      {
        key: "taxId",
        name: tTable("taxId"),
        sortable: false,
        render: (row: ContractorRow) => <span>{row.taxId}</span>,
      },
      {
        key: "mobile",
        name: tTable("mobile"),
        sortable: false,
        render: (row: ContractorRow) => <span>{row.mobile}</span>,
      },
      {
        key: "email",
        name: tTable("email"),
        sortable: false,
        render: (row: ContractorRow) => <span>{row.email}</span>,
      },
      {
        key: "primaryContact",
        name: tTable("primaryContact"),
        sortable: false,
        render: (row: ContractorRow) => <span>{row.primaryContact}</span>,
      },
      {
        key: "classification",
        name: tTable("classification"),
        sortable: false,
        render: (row: ContractorRow) => <span>{row.classification}</span>,
      },
      {
        key: "status",
        name: tTable("status"),
        sortable: false,
        render: (row: ContractorRow) => (
          <Typography
            component="span"
            variant="body2"
            sx={{
              color: contractorStatusColor(row.status),
              fontWeight: 600,
            }}
          >
            {row.status === "active" ? tStatus("active") : tStatus("inactive")}
          </Typography>
        ),
      },
      {
        key: "actions",
        name: tTable("actions"),
        sortable: false,
        render: () => (
          <CustomMenu
            renderAnchor={({ onClick }) => (
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={onClick}
              >
                {tTable("action")}
              </Button>
            )}
          >
            <MenuItem onClick={() => {}}>
              <EditIcon className="w-4 h-4 ml-2" />
              {tTable("edit")}
            </MenuItem>
          </CustomMenu>
        ),
      },
    ],
    [tTable, tStatus],
  );

  const state = ContractorsTableLayout.useTableState({
    data: pageData,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: ContractorRow) => row.id,
    loading: false,
    searchable: true,
    filtered: debouncedSearch.length > 0,
    onExport: async () => {
      // TODO: export when API is available
    },
  });

  return (
    <Box sx={{ p: 3 }}>
      <ContractorsTableLayout
        filters={
          <ContractorsTableLayout.TopActions
            state={state}
            searchComponent={
              state.table.searchable ? (
                <ContractorsTableLayout.Search
                  search={state.search}
                  placeholder={t("searchPlaceholder")}
                />
              ) : undefined
            }
            customActions={
              <Button variant="contained" onClick={() => setAddDialogOpen(true)}>
                {t("addContractor")}
              </Button>
            }
          />
        }
        table={
          <ContractorsTableLayout.Table
            state={state}
            loadingOptions={{ rows: 5 }}
          />
        }
        pagination={<ContractorsTableLayout.Pagination state={state} />}
      />
      <AddContractorDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
      />
    </Box>
  );
}
