"use client";
import { useState } from "react";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { Box, Stack, TextField, Button } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import SetSocialLinkDialog from "./SetSocialLinkDialog";
import withPermissions from "@/lib/permissions/client/withPermissions";
import HeadlessTableLayout from "@/components/headless/table";
import { SocialLink } from "@/services/api/company-dashboard/communication-settings/types/response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CommunicationSettingsSocialLinksApi } from "@/services/api/company-dashboard/communication-settings/social-links";
import { getSocialLinksColumns } from "./columns";

const SOCIAL_LINKS_QUERY_KEY = "communication-settings-social-links";

// Create typed table instance
const SocialLinksTableLayout = HeadlessTableLayout<SocialLink>();

function SocialLinksTable() {
  // Translations
  const t = useTranslations(
    "content-management-system.communicationSetting.socialLinksTable"
  );

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch data using query
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [SOCIAL_LINKS_QUERY_KEY] });
  };

  // ✅ STEP 1: useTableParams (BEFORE query)
  const params = SocialLinksTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  // ✅ STEP 2: Fetch data using useQuery
  const { data: queryData, isLoading } = useQuery({
    queryKey: [
      SOCIAL_LINKS_QUERY_KEY,
      params.page,
      params.limit,
      searchQuery,
      statusFilter,
    ],
    queryFn: async () => {
      const response = await CommunicationSettingsSocialLinksApi.getAll({
        page: params.page,
        per_page: params.limit,
        type: searchQuery || undefined,
        status: statusFilter !== "all" ? Number(statusFilter) : undefined,
      });

      const data = response.data.payload ?? [];
      const pagination = response.data.pagination;

      return {
        data,
        totalPages: pagination?.last_page ?? 1,
        totalItems: pagination?.result_count ?? data.length,
      };
    },
  });

  const data = queryData?.data || [];
  const totalPages = queryData?.totalPages || 0;
  const totalItems = queryData?.totalItems || 0;

  // Define columns
  const columns = getSocialLinksColumns(t);

  // ✅ STEP 3: useTableState (AFTER query)
  const state = SocialLinksTableLayout.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (socialLink: SocialLink) => socialLink.id,
    loading: isLoading,
    filtered: searchQuery !== "" || statusFilter !== "all",
    onExport: async (selectedRows: SocialLink[]) => {
      console.log("Exporting rows:", selectedRows);
      alert(`Exporting ${selectedRows.length} rows`);
    },
    onDelete: async (selectedRows: SocialLink[]) => {
      console.log("Deleting rows:", selectedRows);
      alert(`Deleting ${selectedRows.length} rows`);
    },
  });

  return (
    <Box sx={{ p: 3 }}>
      <SocialLinksTableLayout
        filters={
          <Stack spacing={2}>
            {/* Filter Controls */}
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                size="small"
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  params.setPage(1);
                }}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
                sx={{ flexGrow: 1 }}
              />
              <TextField
                select
                size="small"
                label="Status"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  params.setPage(1);
                }}
                SelectProps={{ native: true }}
                sx={{ minWidth: 150 }}
              >
                <option value="all">All Status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </TextField>
            </Stack>

            {/* Top Actions */}
            <SocialLinksTableLayout.TopActions
              state={state}
              customActions={
                <Stack direction="row" spacing={1}>
                  <Can
                    check={[
                      PERMISSIONS.CMS.communicationSettings.socialLinks.create,
                    ]}
                  >
                    <DialogTrigger
                      component={SetSocialLinkDialog}
                      dialogProps={{ onSuccess: () => invalidate() }}
                      render={({ onOpen }) => (
                        <Button variant="contained" onClick={onOpen}>
                          {t("addSocialLink")}
                        </Button>
                      )}
                    />
                  </Can>
                </Stack>
              }
            />
          </Stack>
        }
        table={
          <SocialLinksTableLayout.Table
            state={state}
            loadingOptions={{ rows: 5 }}
          />
        }
        pagination={<SocialLinksTableLayout.Pagination state={state} />}
      />
    </Box>
  );
}

export default withPermissions(SocialLinksTable, [
  PERMISSIONS.CMS.communicationSettings.socialLinks.list,
]);
