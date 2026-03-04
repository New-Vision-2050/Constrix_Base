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
  IconButton,
  Popover,
  ListItemText,
  Checkbox,
  ListItemIcon,
  ListItemButton,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { FileText } from "lucide-react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import OfferStatusChip from "./OfferStatusChip";
import OfferDetailsDialog from "./OfferDetailsDialog";
import PricesOffersWidgets from "./PricesOffersWidgets";
import { ClientRequestsApi } from "@/services/api/client-requests";
import type { ClientRequestRow } from "@/services/api/client-requests/types/response";
import type { ClientRequestListParams } from "@/services/api/client-requests/types/params";

const PricesOffersTable =
  HeadlessTableLayout<ClientRequestRow>("prices-offers");

const FILTER_OPTIONS = [
  { key: "referenceNumber", labelKey: "referenceNumber" },
  { key: "offerNumber", labelKey: "offerNumber" },
  { key: "offerStatus", labelKey: "offerStatus" },
  { key: "endDate", labelKey: "endDate" },
  { key: "responsiblePerson", labelKey: "responsiblePerson" },
] as const;

type FilterKey = (typeof FILTER_OPTIONS)[number]["key"];

export default function PricesOffersIndex() {
  const t = useTranslations("pricesOffers.searchFilter");
  const tTable = useTranslations("pricesOffers.table");
  const [selectedFilters, setSelectedFilters] = useState<FilterKey[]>([
    "offerStatus",
    "referenceNumber",
    "offerNumber",
    "endDate",
    "responsiblePerson",
  ]);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const [referenceNumber, setReferenceNumber] = useState("");
  const [offerNumber, setOfferNumber] = useState("");
  const [endDate, setEndDate] = useState("");
  const [offerStatus, setOfferStatus] = useState<string>("");
  const [responsiblePerson, setResponsiblePerson] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ClientRequestRow | null>(null);

  const params = PricesOffersTable.useTableParams({
    initialPage: 1,
    initialLimit: 15,
  });

  const handleToggleFilter = (key: FilterKey) => {
    setSelectedFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key],
    );
  };

  const listParams = useMemo((): ClientRequestListParams => {
    const p: ClientRequestListParams = {
      page: params.page,
      per_page: params.limit,
      content: params.search,
      status_client_request: "accepted", // Just Accepted Request
    };
    const contentParts: string[] = [];
    if (selectedFilters.includes("referenceNumber") && referenceNumber) {
      contentParts.push(referenceNumber);
    }
    if (selectedFilters.includes("offerNumber") && offerNumber) {
      contentParts.push(offerNumber);
    }
    if (selectedFilters.includes("offerStatus") && offerStatus) {
      p.client_price_offer_status =
        offerStatus as ClientRequestListParams["client_price_offer_status"];
    }
    if (selectedFilters.includes("endDate") && endDate) {
      p.created_at_to = endDate;
    }
    if (
      selectedFilters.includes("responsiblePerson") &&
      responsiblePerson &&
      !Number.isNaN(Number(responsiblePerson))
    ) {
      p.client_request_receiver_from_id = Number(responsiblePerson);
    }
    if (contentParts.length > 0) {
      p.content = contentParts.join(" ");
    }
    return p;
  }, [
    params.page,
    params.limit,
    selectedFilters,
    referenceNumber,
    offerNumber,
    offerStatus,
    endDate,
    responsiblePerson,
    params.search,
  ]);

  const { data, isLoading } = useQuery({
    queryKey: ["client-requests", listParams],
    queryFn: async () => {
      const response = await ClientRequestsApi.list(listParams);
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
        render: (row: ClientRequestRow) => (
          <span className="p-2 text-sm">{row.serial_number}</span>
        ),
      },
      {
        key: "offerName",
        name: tTable("offerName"),
        sortable: false,
        render: (row: ClientRequestRow) => (
          <span className="p-2 text-sm">{row.content}</span>
        ),
      },
      {
        key: "clientName",
        name: tTable("clientName"),
        sortable: false,
        render: (row: ClientRequestRow) => (
          <span className="p-2 text-sm">{row.client?.name ?? "—"}</span>
        ),
      },
      {
        key: "management",
        name: tTable("management"),
        sortable: false,
        render: (row: ClientRequestRow) => (
          <span className="p-2 text-sm">{row.management?.name ?? "—"}</span>
        ),
      },
      {
        key: "financialResponsible",
        name: tTable("financialResponsible"),
        sortable: false,
        render: (row: ClientRequestRow) => (
          // TODO: Add financial responsible name
          <span className="p-2 text-sm">
            {row.financial_responsible?.name ??  "—"}
          </span>
        ),
      },
      {
        key: "offerStatus",
        name: tTable("offerStatus"),
        sortable: false,
        render: (row: ClientRequestRow) => (
          <OfferStatusChip status={row.client_price_offer_status ?? "-"} />
        ),
      },
      {
        key: "mediator",
        name: tTable("mediator"),
        sortable: false,
        render: (row: ClientRequestRow) => (
          // TODO: Add mediator name
          <span className="p-2 text-sm">{row.management?.name ?? "—"}</span>
        ),
      },
      {
        key: "attachments",
        name: tTable("attachments"),
        sortable: false,
        render: (row: ClientRequestRow) =>
          row.attachments && row.attachments?.length > 0 ? (
            <span className="p-2 text-sm flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-500" />
              {row.attachments?.length}
            </span>
          ) : (
            <span className="p-2 text-sm">—</span>
          ),
      },
      {
        key: "actions",
        name: tTable("actions"),
        sortable: false,
        render: (row: ClientRequestRow) => (
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
            <MenuItem
              onClick={() => {
                setSelectedRow(row);
                setViewDialogOpen(true);
              }}
            >
              {tTable("view")}
            </MenuItem>
            <MenuItem onClick={() => {}}>{tTable("edit")}</MenuItem>
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
    getRowId: (row: ClientRequestRow) => row.id,
    loading: isLoading,
    searchable: true,
    filtered:
      params.search !== "" ||
      !!referenceNumber ||
      !!offerNumber ||
      !!offerStatus ||
      !!endDate ||
      !!responsiblePerson,
    onExport: async () => {
      // TODO: implement export
    },
  });

  return (
    <div>
      <PricesOffersWidgets />

      {selectedFilters.length > 0 && (
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
            {selectedFilters.includes("referenceNumber") && (
              <TextField
                size="small"
                label={t("referenceNumber")}
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                fullWidth
              />
            )}
            {selectedFilters.includes("offerNumber") && (
              <TextField
                size="small"
                label={t("offerNumber")}
                value={offerNumber}
                onChange={(e) => setOfferNumber(e.target.value)}
                fullWidth
              />
            )}
            {selectedFilters.includes("offerStatus") && (
              <FormControl size="small" fullWidth>
                <InputLabel>{t("offerStatus")}</InputLabel>
                <Select
                  value={offerStatus}
                  label={t("offerStatus")}
                  onChange={(e) => setOfferStatus(e.target.value)}
                >
                  <MenuItem value="">{t("all")}</MenuItem>
                  <MenuItem value="draft">{t("draft")}</MenuItem>
                  <MenuItem value="pending">{tTable("pending")}</MenuItem>
                  <MenuItem value="accepted">{tTable("accepted")}</MenuItem>
                  <MenuItem value="rejected">{tTable("rejected")}</MenuItem>
                </Select>
              </FormControl>
            )}
            {selectedFilters.includes("endDate") && (
              <TextField
                size="small"
                label={t("endDate")}
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            )}
            {selectedFilters.includes("responsiblePerson") && (
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
            )}
          </Box>
        </Box>
      )}

      <Box sx={{ p: 0 }}>
        <PricesOffersTable
          filters={
            <PricesOffersTable.TopActions
              state={state}
              searchComponent={
                <PricesOffersTable.Search
                  search={state.search}
                  placeholder={t("search")}
                />
              }
              customActions={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Button variant="contained" color="primary" sx={{ px: 3 }}>
                    {tTable("createOffer")}
                  </Button>

                  <IconButton
                    color={selectedFilters.length > 0 ? "primary" : "default"}
                    onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                    title={t("chooseFilters")}
                    size="small"
                  >
                    <TuneIcon />
                  </IconButton>
                  <Popover
                    open={Boolean(filterAnchorEl)}
                    anchorEl={filterAnchorEl}
                    onClose={() => setFilterAnchorEl(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <Box sx={{ py: 1, minWidth: 200 }}>
                      <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
                        {t("chooseFilters")}
                      </Typography>
                      {FILTER_OPTIONS.map((opt) => (
                        <ListItemButton
                          key={opt.key}
                          onClick={() => handleToggleFilter(opt.key)}
                          dense
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Checkbox
                              edge="start"
                              checked={selectedFilters.includes(opt.key)}
                              disableRipple
                            />
                          </ListItemIcon>
                          <ListItemText primary={t(opt.labelKey)} />
                        </ListItemButton>
                      ))}
                    </Box>
                  </Popover>
                </Box>
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

      <OfferDetailsDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        row={selectedRow}
      />
    </div>
  );
}
