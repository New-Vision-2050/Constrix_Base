"use client";
import { useEffect, useMemo, useState } from "react";
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

  // Fetch data using query
  const queryClient = useQueryClient();

  const { data: socialLinksData, isLoading: isFetchingSocialLinks } = useQuery({
    queryKey: [SOCIAL_LINKS_QUERY_KEY],
    queryFn: async () => {
      const response = await CommunicationSettingsSocialLinksApi.getAll();
      return response.data.payload;
    },
  });

  const socialLinks = useMemo(() => socialLinksData ?? [], [socialLinksData]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [SOCIAL_LINKS_QUERY_KEY] });
  };

  const [tableData, setTableData] = useState<SocialLink[]>([]);

  useEffect(() => {
    setTableData(socialLinks);
  }, [socialLinks]);

  // Filter data based on search and role
  const filteredSocialLinks = tableData.filter((socialLink) => {
    const matchesSearch =
      (socialLink.type?.name ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (socialLink.link ?? "-")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Define columns
  const columns = getSocialLinksColumns(t);

  // Initialize table state
  const state = SocialLinksTableLayout.useState({
    data: filteredSocialLinks,
    columns,
    selectable: true,
    getRowId: (socialLink) => socialLink.id,
    loading: isFetchingSocialLinks,
    filtered: searchQuery !== "",
    onExport: async (selectedRows) => {
      console.log("Exporting rows:", selectedRows);
      alert(`Exporting ${selectedRows.length} rows`);
    },
    onDelete: async (selectedRows) => {
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
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
                sx={{ flexGrow: 1 }}
              />
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
