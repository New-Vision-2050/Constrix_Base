"use client";
import { useMemo, useState } from "react";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Box, Button, MenuItem, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import SetSocialLinkDialog from "./SetSocialLinkDialog";
import withPermissions from "@/lib/permissions/client/withPermissions";
import HeadlessTableLayout from "@/components/headless/table";
import { SocialLink } from "@/services/api/company-dashboard/communication-settings/types/response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CommunicationSettingsSocialLinksApi } from "@/services/api/company-dashboard/communication-settings/social-links";
import { getSocialLinksColumns } from "./columns";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import CustomMenu from "@/components/headless/custom-menu";
import { baseURL } from "@/config/axios-config";
import { EditIcon, Trash2 } from "lucide-react";
import { downloadFromResponse } from "@/utils/downloadFromResponse";
import Can from "@/lib/permissions/client/Can";
import DialogTrigger from "@/components/headless/dialog-trigger";

const SOCIAL_LINKS_QUERY_KEY = "communication-settings-social-links";

// Create typed table instance
const SocialLinksTableLayout = HeadlessTableLayout<SocialLink>("cssl");

function SocialLinksTable() {
  // Translations
  const t = useTranslations(
    "content-management-system.communicationSetting.socialLinksTable",
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

  // Fetch data using query
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [SOCIAL_LINKS_QUERY_KEY] });
  };

  // ✅ STEP 1: useTableParams (BEFORE query)
  const params = SocialLinksTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
    initialSortBy: "type",
    initialSortDirection: "asc",
  });

  // ✅ STEP 2: Fetch data using useQuery directly
  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      SOCIAL_LINKS_QUERY_KEY,
      params.page,
      params.limit,
      params.sortBy,
      params.sortDirection,
      params.search,
    ],
    queryFn: async () => {
      const response = await CommunicationSettingsSocialLinksApi.getAll({
        page: params.page,
        per_page: params.limit,
        sort_by: params.sortBy,
        sort_direction: params.sortDirection,
        type: params.search,
      });

      return response.data;
    },
  });

  // Extract data from response
  const socialLinks = useMemo<SocialLink[]>(() => data?.payload || [], [data]);
  const totalPages = useMemo(() => data?.pagination?.last_page || 1, [data]);
  const totalItems = useMemo(() => data?.pagination?.result_count || 0, [data]);

  // Define columns
  const columns = [
    ...getSocialLinksColumns(t),
    {
      key: "actions",
      name: t("actions"),
      sortable: false,
      render: (row: SocialLink) => (
        <CustomMenu
          renderAnchor={({ onClick }) => (
            <Button onClick={onClick}>{t("actions")}</Button>
          )}
        >
          <MenuItem
            onClick={() => {
              setEditingSocialLinkId(row.id);
              setEditDialogOpen(true);
            }}
          >
            <EditIcon className="w-4 h-4 ml-2" />
            {t("edit")}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setDeletingSocialLinkId(row.id);
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="w-4 h-4 ml-2" />
            {t("delete")}
          </MenuItem>
        </CustomMenu>
      ),
    },
  ];

  // ✅ STEP 3: useTableState (AFTER query)
  const state = SocialLinksTableLayout.useTableState({
    data: socialLinks,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (socialLink: SocialLink) => socialLink.id,
    loading: isLoading,
    searchable: true,
    onExport: async () => {
      downloadFromResponse(await CommunicationSettingsSocialLinksApi.export());
    },
  });

  return (
    <Box>
      <Typography variant="h6" sx={{ my: 4 }}>
        {t("title")}
      </Typography>
      <SocialLinksTableLayout
        filters={
          <SocialLinksTableLayout.TopActions
            state={state}
            customActions={
              <Can
                check={[
                  PERMISSIONS.CMS.communicationSettings.socialLinks.create,
                ]}
              >
                <DialogTrigger
                  component={SetSocialLinkDialog}
                  dialogProps={{
                    onSuccess: () => {
                      refetch();
                    },
                  }}
                  render={({ onOpen }) => (
                    <Button variant="contained" onClick={onOpen}>
                      {t("addSocialLink")}
                    </Button>
                  )}
                />
              </Can>
            }
          ></SocialLinksTableLayout.TopActions>
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
