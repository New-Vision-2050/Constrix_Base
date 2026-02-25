"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import StatisticsCardHeader from "../organizational-structure/components/StatisticsCard/StatisticsCardHeader";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TopicIcon from "@mui/icons-material/Topic";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import TrendingUpSharpIcon from "@mui/icons-material/TrendingUpSharp";
import PaidIcon from "@mui/icons-material/Paid";
import {
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { FileText } from "lucide-react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import { PriceOffer } from "./types";
import OfferStatusChip from "./OfferStatusChip";
import { getClientRequests } from "@/services/api/client-requests";
import type { ClientRequest } from "@/services/api/client-requests/types/response";

// Map API response to table row format
function mapClientRequestToPriceOffer(item: ClientRequest): PriceOffer {
  const raw = item as Record<string, unknown>;
  return {
    id: String(item.id),
    referenceNumber: (raw.reference_number ?? raw.referenceNumber ?? item.id) as string,
    offerName: (raw.offer_name ?? raw.offerName ?? raw.name ?? "—") as string,
    clientName: (raw.client_name ?? raw.clientName ?? "—") as string,
    department: (raw.department ?? raw.branch_name ?? "—") as string,
    financialResponsible: (raw.financial_responsible ?? raw.financialResponsible ?? "—") as string,
    offerStatus: (raw.status_client_request ?? raw.offerStatus ?? "pending") as PriceOffer["offerStatus"],
    mediator: (raw.mediator ?? raw.broker_name ?? "—") as string,
    hasAttachment: Boolean(
      raw.has_attachment ?? raw.hasAttachment ?? (Array.isArray(raw.attachments) && raw.attachments.length > 0)
    ),
  };
}


const PricesOffersTable = HeadlessTableLayout<PriceOffer>("prices-offers");

export default function PricesOffersIndex() {
  const t = useTranslations("pricesOffers.searchFilter");
  const tTable = useTranslations("pricesOffers.table");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [offerNumber, setOfferNumber] = useState("");
  const [offerStatus, setOfferStatus] = useState("pending");
  const [endDate, setEndDate] = useState("");
  const [responsiblePerson, setResponsiblePerson] = useState("");

  const params = PricesOffersTable.useTableParams({
    initialPage: 1,
    initialLimit: 15,
  });

  const { data: apiData, isLoading } = useQuery({
    queryKey: [
      "client-requests",
      params.page,
      params.limit,
      params.search,
      offerStatus,
      referenceNumber,
      offerNumber,
    ],
    queryFn: () =>
      getClientRequests({
        page: params.page,
        per_page: params.limit,
        status_client_request: offerStatus
          ? (offerStatus as "accepted" | "pending" | "rejected" | "draft")
          : "pending",
        content: params.search || undefined,
      }),
  });

  const data = useMemo(
    () => (apiData?.payload ?? []).map(mapClientRequestToPriceOffer),
    [apiData]
  );
  const totalPages = apiData?.pagination?.last_page ?? 1;
  const totalItems = apiData?.pagination?.result_count ?? 0;

  const columns = useMemo(
    () => [
      {
        key: "referenceNumber",
        name: tTable("referenceNumber"),
        sortable: false,
        render: (row: PriceOffer) => <span className="p-2 text-sm">{row.referenceNumber}</span>,
      },
      {
        key: "offerName",
        name: tTable("offerName"),
        sortable: false,
        render: (row: PriceOffer) => <span className="p-2 text-sm">{row.offerName}</span>,
      },
      {
        key: "clientName",
        name: tTable("clientName"),
        sortable: false,
        render: (row: PriceOffer) => <span className="p-2 text-sm">{row.clientName}</span>,
      },
      {
        key: "department",
        name: tTable("department"),
        sortable: false,
        render: (row: PriceOffer) => <span className="p-2 text-sm">{row.department}</span>,
      },
      {
        key: "financialResponsible",
        name: tTable("financialResponsible"),
        sortable: false,
        render: (row: PriceOffer) => <span className="p-2 text-sm">{row.financialResponsible}</span>,
      },
      {
        key: "offerStatus",
        name: tTable("offerStatus"),
        sortable: false,
        render: (row: PriceOffer) => <OfferStatusChip status={row.offerStatus} />,
      },
      {
        key: "mediator",
        name: tTable("mediator"),
        sortable: false,
        render: (row: PriceOffer) => <span className="p-2 text-sm">{row.mediator}</span>,
      },
      {
        key: "attachments",
        name: tTable("attachments"),
        sortable: false,
        render: (row: PriceOffer) =>
          row.hasAttachment ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <FileText className="w-5 h-5 text-red-500" />
              <span className="text-sm">{tTable("report")}</span>
            </Box>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
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
                color="info"
                onClick={onClick}
                endIcon={<KeyboardArrowDownIcon />}
              >
                {tTable("action")}
              </Button>
            )}
          >
            <MenuItem onClick={() => {}}>عرض</MenuItem>
            <MenuItem onClick={() => {}}>تعديل</MenuItem>
          </CustomMenu>
        ),
      },
    ],
    [tTable]
  );

  const state = PricesOffersTable.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: PriceOffer) => row.id,
    loading: isLoading,
    searchable: true,
    filtered: params.search !== "" || !!offerStatus || !!referenceNumber || !!offerNumber,
    onExport: async () => {
      // TODO: implement export
    },
  });

  useEffect(() => {
    console.log(data);
  },[data])

  return (
    <div>
      <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2 mb-4">
        <StatisticsCardHeader
          title="إجمالي الأسعار"
          number={125}
          icon={<PaidIcon color="success" />}
        />
        <StatisticsCardHeader
          title="محول لعقد"
          number={25}
          icon={<CheckCircleIcon color="primary" />}
        />
        <StatisticsCardHeader
          title="عروض مقبولة"
          number={35}
          icon={<TrendingUpSharpIcon color="success" />}
        />
        <StatisticsCardHeader
          title="عروض مرفوضة"
          number={8}
          icon={<EventBusyIcon color="error" />}
        />
        <StatisticsCardHeader
          title="إجمالي المسودة"
          number={5}
          icon={<TopicIcon color="warning" />}
        />
      </div>

      <Box className="p-4 rounded-lg mb-4 bg-sidebar">
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t("title")}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(5, 1fr)",
            },
            gap: 2,
          }}
        >
          <TextField
            size="small"
            label={t("referenceNumber")}
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            fullWidth
          />
          <TextField
            size="small"
            label={t("offerNumber")}
            value={offerNumber}
            onChange={(e) => setOfferNumber(e.target.value)}
            fullWidth
          />
          <FormControl size="small" fullWidth>
            <InputLabel>{t("offerStatus")}</InputLabel>
            <Select
              value={offerStatus}
              label={t("offerStatus")}
              onChange={(e) => setOfferStatus(e.target.value)}
            >
              <MenuItem value="">{t("all")}</MenuItem>
              <MenuItem value="draft">مسودة</MenuItem>
              <MenuItem value="pending">قيد الانتظار</MenuItem>
              <MenuItem value="accepted">مقبول</MenuItem>
              <MenuItem value="rejected">مرفوض</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            label={t("endDate")}
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <FormControl size="small" fullWidth>
            <InputLabel>{t("responsiblePerson")}</InputLabel>
            <Select
              value={responsiblePerson}
              label={t("responsiblePerson")}
              onChange={(e) => setResponsiblePerson(e.target.value)}
            >
              <MenuItem value="">{t("all")}</MenuItem>
              {/* TODO: Populate from API when available */}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ p: 0 }}>
        <PricesOffersTable
          filters={
            <PricesOffersTable.TopActions
              state={state}
              searchComponent={
                <PricesOffersTable.Search
                  search={state.search}
                  placeholder="بحث"
                />
              }
              customActions={
                <Button variant="contained" color="primary" sx={{ px: 3 }}>
                  {tTable("createOffer")}
                </Button>
              }
            />
          }
          table={
            <PricesOffersTable.Table
              state={state}
              loadingOptions={{ rows: 5 }}
            />
          }
          pagination={<PricesOffersTable.Pagination state={state} />}
        />
      </Box>
    </div>
  );
}