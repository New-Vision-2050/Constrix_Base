"use client";

import { useCallback, useMemo } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { ClientRequestsApi } from "@/services/api/client-requests";
import { CrmClientRequestDetailsParts } from "@/modules/crm-settings/inbox/components/CrmClientRequestDetailsParts";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { ROUTER } from "@/router";
import { CRM_INBOX_PENDING_COUNT_QUERY_KEY } from "@/components/icons/crm-inbox";
import { CRM_INBOX_LIST_QUERY_KEY } from "@/modules/crm-settings/query-keys";

const CLIENT_REQUESTS_QUERY_KEY = "client-requests-list";
const clientRequestDetailKey = (id: string) =>
  ["client-request-detail", id] as const;

function getApiErrorDescription(error: unknown): string | undefined {
  const data = axios.isAxiosError(error)
    ? error.response?.data
    : (error as { response?: { data?: unknown } })?.response?.data;
  if (!data || typeof data !== "object") return undefined;
  const body = data as { description?: string; message?: unknown };
  if (typeof body.description === "string" && body.description.trim())
    return body.description.trim();
  if (typeof body.message === "string") return body.message;
  return undefined;
}

type ClientRequestDetailsViewProps = {
  requestId: string;
};

export default function ClientRequestDetailsView({
  requestId,
}: ClientRequestDetailsViewProps) {
  const t = useTranslations();
  const tInbox = useTranslations("project.inbox");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { can } = usePermissions();
  const canUpdateClientRequest = can(PERMISSIONS.clientRequest.update);

  const { data: row, isLoading, isError } = useQuery({
    queryKey: clientRequestDetailKey(requestId),
    queryFn: async () => {
      const res = await ClientRequestsApi.show(requestId);
      return res.data.payload ?? null;
    },
    enabled: Boolean(requestId),
  });

  const invalidateClientRequestsList = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [CLIENT_REQUESTS_QUERY_KEY] });
    queryClient.invalidateQueries({
      queryKey: CRM_INBOX_PENDING_COUNT_QUERY_KEY,
    });
    queryClient.invalidateQueries({ queryKey: [CRM_INBOX_LIST_QUERY_KEY] });
    queryClient.invalidateQueries({
      queryKey: clientRequestDetailKey(requestId),
    });
  }, [queryClient, requestId]);

  const statusMutation = useMutation({
    mutationFn: (vars: {
      id: string;
      status: "accepted" | "rejected";
      reject_cause?: string;
    }) =>
      vars.status === "accepted"
        ? ClientRequestsApi.updateStatus(vars.id, {
            status_client_request: "accepted",
          })
        : ClientRequestsApi.updateStatus(vars.id, {
            status_client_request: "rejected",
            reject_cause: vars.reject_cause ?? "",
          }),
    onSuccess: (_data, vars) => {
      toast.success(
        vars.status === "accepted"
          ? t("clientRequests.inbox.toastAcceptSuccess")
          : t("clientRequests.inbox.toastRejectSuccess"),
      );
      invalidateClientRequestsList();
    },
    onError: (error: unknown) => {
      toast.error(
        getApiErrorDescription(error) ??
          t("clientRequests.inbox.toastOperationError"),
      );
    },
  });

  const pendingStatusAction = statusMutation.isPending;

  const detailsCanRespond = useMemo(
    () =>
      String(row?.status_client_request ?? "")
        .trim()
        .toLowerCase() === "pending",
    [row?.status_client_request],
  );

  const handleBack = useCallback(() => {
    router.push(ROUTER.CRM.clientRequests);
  }, [router]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 320,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !row) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{t("clientRequests.details.loadError")}</Typography>
      </Box>
    );
  }

  return (
    <Box className="w-full max-w-none p-6">
      <Stack direction="row" alignItems="flex-start" spacing={1} sx={{ mb: 2 }}>
        <IconButton
          aria-label={t("clientRequests.details.backToList")}
          onClick={handleBack}
          size="small"
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" fontWeight={700}>
            {tInbox("dialogTitle")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t("clientRequests.inbox.dialogSubtitle")}
          </Typography>
          {row.serial_number ? (
            <Typography variant="body2" color="text.secondary">
              {row.serial_number}
            </Typography>
          ) : null}
        </Box>
      </Stack>

      <Paper
        className="bg-sidebar"
        sx={{ width: "100%", maxWidth: "100%", overflow: "hidden" }}
      >
        <Tabs
          value={0}
          aria-label={t("clientRequests.details.tabs.details")}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "4px 4px 0 0",
            },
            "& .MuiTab-root": { textTransform: "none", minHeight: 56 },
          }}
        >
          <Tab label={t("clientRequests.details.tabs.details")} />
          <Tab label={t("clientRequests.details.tabs.items")} disabled />
          <Tab label={t("clientRequests.details.tabs.actions")} disabled />
          <Tab label={t("clientRequests.details.tabs.attachments")} disabled />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <CrmClientRequestDetailsParts
            row={row}
            onAccept={() => {
              statusMutation.mutate({ id: row.id, status: "accepted" });
            }}
            onReject={(rejectCause) => {
              statusMutation.mutate({
                id: row.id,
                status: "rejected",
                reject_cause: rejectCause,
              });
            }}
            onClose={handleBack}
            actionPending={pendingStatusAction}
            canRespond={detailsCanRespond}
            canUpdateStatus={canUpdateClientRequest}
          >
            {({ fileViewer, main, sidebar }) => (
              <>
                {fileViewer}
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 8.5 }}>{main}</Grid>
                  <Grid size={{ xs: 12, md: 3.5 }}>{sidebar}</Grid>
                </Grid>
              </>
            )}
          </CrmClientRequestDetailsParts>
        </Box>
      </Paper>
    </Box>
  );
}
