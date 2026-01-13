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
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import Execution from "@/app/[locale]/(main)/companies/cells/execution";
import { baseURL } from "@/config/axios-config";
import { EditIcon, Trash2 } from "lucide-react";

const SOCIAL_LINKS_QUERY_KEY = "communication-settings-social-links";

// Create typed table instance
const SocialLinksTableLayout = HeadlessTableLayout<SocialLink>();

function SocialLinksTable() {
  // Translations
  const t = useTranslations(
    "content-management-system.communicationSetting.socialLinksTable"
  );
  const queryClient = useQueryClient();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSocialLinkId, setEditingSocialLinkId] = useState<
    string | undefined
  >();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingSocialLinkId, setDeletingSocialLinkId] = useState<
    string | undefined
  >();

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data using query
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
    queryKey: [SOCIAL_LINKS_QUERY_KEY, params.page, params.limit, searchQuery],
    queryFn: async () => {
      const response = await CommunicationSettingsSocialLinksApi.getAll({
        page: params.page,
        per_page: params.limit,
        type: searchQuery || undefined,
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
  const columns = [
    ...getSocialLinksColumns(t),
    {
      key: "actions",
      name: t("actions"),
      sortable: false,
      render: (row: SocialLink) => (
        <Execution
          row={row as unknown as { id: string; [key: string]: unknown }}
          buttonLabel={t("actions")}
          className="px-5 rotate-svg-child"
          showEdit={false}
          showDelete={false}
          executions={[
            {
              label: t("edit"),
              icon: <EditIcon className="w-4 h-4" />,
              disabled: true,
              action: () => {
                setEditingSocialLinkId(row.id);
                setEditDialogOpen(true);
              },
            },
            {
              label: t("delete"),
              icon: <Trash2 className="w-4 h-4" />,
              disabled: true,
              action: () => {
                setDeletingSocialLinkId(row.id);
                setDeleteDialogOpen(true);
              },
            },
          ]}
        />
      ),
    },
  ];

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
    filtered: searchQuery !== "",
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
            <Stack direction="row" spacing={2}>
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
                sx={{ flex: 9 }}
              />
              <Box sx={{ flex: 3 }}>
                <Can
                  check={[
                    PERMISSIONS.CMS.communicationSettings.socialLinks.create,
                  ]}
                >
                  <DialogTrigger
                    component={SetSocialLinkDialog}
                    dialogProps={{ onSuccess: () => invalidate() }}
                    render={({ onOpen }) => (
                      <Button variant="contained" onClick={onOpen} fullWidth>
                        {t("addSocialLink")}
                      </Button>
                    )}
                  />
                </Can>
              </Box>
            </Stack>
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

      {/* Edit Dialog */}
      <SetSocialLinkDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingSocialLinkId(undefined);
        }}
        onSuccess={() => {
          invalidate();
          setEditDialogOpen(false);
          setEditingSocialLinkId(undefined);
        }}
        socialLinkId={editingSocialLinkId}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        deleteUrl={`${baseURL}/social-media-links/${deletingSocialLinkId}`}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeletingSocialLinkId(undefined);
        }}
        open={deleteDialogOpen}
        onSuccess={() => {
          invalidate();
          setDeleteDialogOpen(false);
          setDeletingSocialLinkId(undefined);
        }}
      />
    </Box>
  );
}

export default withPermissions(SocialLinksTable, [
  PERMISSIONS.CMS.communicationSettings.socialLinks.list,
]);
