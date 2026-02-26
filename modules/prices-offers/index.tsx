"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
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
import OfferStatusChip from "./OfferStatusChip";
import PricesOffersWidgets from "./PricesOffersWidgets";
import { ClientRequestsApi } from "@/services/api/client-requests";
import type { ClientRequest } from "@/services/api/client-requests/types/response";

const PricesOffersTable = HeadlessTableLayout<ClientRequest>("prices-offers");

export default function PricesOffersIndex() {
  const t = useTranslations("pricesOffers.searchFilter");
  const tTable = useTranslations("pricesOffers.table");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [offerNumber, setOfferNumber] = useState("");
  const [endDate, setEndDate] = useState("");
  const [responsiblePerson, setResponsiblePerson] = useState("");

  const params = PricesOffersTable.useTableParams({
    initialPage: 1,
    initialLimit: 15,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["client-requests", params.page, params.limit],
    queryFn: async () => {
      const response = await ClientRequestsApi.list({
        page: params.page,
        per_page: params.limit,
        status_client_request: "accepted",
      });
      return response.data;
    },
  });

  const clientRequests = data?.payload || [];

  const totalPages = data?.pagination?.last_page ?? 1;
  const totalItems = data?.pagination?.result_count ?? 0;

  const columns = useMemo(
    () => [
      {
        key: "referenceNumber",
        name: tTable("referenceNumber"),
        sortable: false,
        render: (row: ClientRequest) => (
          <span className="p-2 text-sm">{row.client_request_type_id}</span>
        ),
      },
      {
        key: "offerName",
        name: tTable("offerName"),
        sortable: false,
        render: (row: ClientRequest) => (
          <span className="p-2 text-sm">{row.content}</span>
        ),
      },
      {
        key: "clientName",
        name: tTable("clientName"),
        sortable: false,
        render: (row: ClientRequest) => (
          <span className="p-2 text-sm">{row.client?.name ?? "—"}</span>
        ),
      },
      {
        key: "management",
        name: tTable("management"),
        sortable: false,
        render: (row: ClientRequest) => (
          <span className="p-2 text-sm">{row.management?.name ?? "—"}</span>
        ),
      },
      {
        key: "financialResponsible",
        name: tTable("financialResponsible"),
        sortable: false,
        render: (row: ClientRequest) => (
          // TODO: Add financial responsible name
          <span className="p-2 text-sm">
            {row.client_request_receiver_from?.name ?? "—"}
          </span>
        ),
      },
      {
        key: "offerStatus",
        name: tTable("offerStatus"),
        sortable: false,
        render: (row: ClientRequest) => (
          <OfferStatusChip
            status={row.client_price_offer_status ?? row.status_client_request}
          />
        ),
      },
      {
        key: "mediator",
        name: tTable("mediator"),
        sortable: false,
        render: (row: ClientRequest) => (
          // TODO: Add mediator name
          <span className="p-2 text-sm">{row.management?.name ?? "—"}</span>
        ),
      },
      {
        key: "attachments",
        name: tTable("attachments"),
        sortable: false,
        render: (row: ClientRequest) =>
          row.term_setting_id !== null ||
          (row.attachments && row.attachments.length > 0) ? (
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
    [tTable],
  );

  const state = PricesOffersTable.useTableState({
    data: clientRequests,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: ClientRequest) => row.id,
    loading: isLoading,
    searchable: true,
    filtered: params.search !== "" || !!referenceNumber || !!offerNumber,
    onExport: async () => {
      // TODO: implement export
    },
  });

  return (
    <div>
      <PricesOffersWidgets />

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
            <Select value={t("offerStatus")} label={t("offerStatus")}>
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
