import { Button, Chip, MenuItem } from "@mui/material";
import type { ProjectInboxRow } from "@/modules/projects/inbox/map-invitation-to-row";
import CustomMenu from "@/components/headless/custom-menu";
import { EyeIcon } from "lucide-react";

export function formatInboxSentDate(iso: string): string {
  if (!iso?.trim()) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

function inboxShareStatusLabel(
  status: string,
  t: (key: string) => string,
): string {
  const key = status.trim().toLowerCase();
  switch (key) {
    case "pending":
      return t("statusPending");
    case "sent":
      return t("statusSent");
    case "draft":
    case "under_construction":
      return t("statusDraft");
    case "accepted":
    case "approved":
      return t("statusAccepted");
    case "rejected":
      return t("statusRejected");
    default:
      return status || t("emptyDash");
  }
}

function inboxShareStatusColor(status: string): "primary" | "warning" | "success" | "error" | "default" {
  const key = status.trim().toLowerCase();
  switch (key) {
    case "sent":
      return "primary";
    case "pending":
      return "warning";
    case "draft":
    case "under_construction":
      return "warning";
    case "accepted":
    case "approved":
      return "success";
    case "rejected":
      return "error";
    default:
      return "default";
  }
}

export type GetInboxColumnsOptions = {
  t: (key: string) => string;
  pendingMutation: boolean;
  onAccept: (invitationId: string) => void;
  onReject: (invitationId: string) => void;
  onView: (row: ProjectInboxRow) => void;
};

export function getInboxColumns({
  t,
  pendingMutation,
  onAccept,
  onReject,
  onView,
}: GetInboxColumnsOptions) {
  const dash = () => t("emptyDash");
  return [
    {
      key: "inbox_type_label",
      name: t("fieldType"),
      sortable: false,
      render: (row: ProjectInboxRow) => (
        <span>{row.inbox_type_label || dash()}</span>
      ),
    },
    {
      key: "name",
      name: t("columnName"),
      sortable: false,
      render: (row: ProjectInboxRow) => (
        <span className="font-medium">{row.name || dash()}</span>
      ),
    },
    {
      key: "sender_company_name",
      name: t("columnSenderCompany"),
      sortable: false,
      render: (row: ProjectInboxRow) => (
        <span>
          {row.sender_company_name?.trim()
            ? row.sender_company_name
            : dash()}
        </span>
      ),
    },
    {
      key: "reference_display",
      name: t("columnReference"),
      sortable: false,
      render: (row: ProjectInboxRow) => (
        <span>{row.reference_display || dash()}</span>
      ),
    },
    {
      key: "representative_name",
      name: t("columnRepresentative"),
      sortable: false,
      render: (row: ProjectInboxRow) => (
        <span>
          {row.representative_name?.trim()
            ? row.representative_name
            : dash()}
        </span>
      ),
    },
    {
      key: "sent_at_raw",
      name: t("columnSentDate"),
      sortable: false,
      render: (row: ProjectInboxRow) => {
        const formatted = formatInboxSentDate(row.sent_at_raw);
        return (
          <span>
            {formatted.trim() ? formatted : dash()}
          </span>
        );
      },
    },
    {
      key: "invitation_status",
      name: t("columnStatus"),
      sortable: false,
      render: (row: ProjectInboxRow) => {
        const label = inboxShareStatusLabel(row.invitation_status, t);
        return (
          <Chip
            label={label}
            color={inboxShareStatusColor(row.invitation_status)}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      },
    },
    {
      key: "actions",
      name: t("columnActions"),
      sortable: false,
      render: (row: ProjectInboxRow) => {
        const canRespond =
          (row.invitation_status ?? "").trim().toLowerCase() === "pending";
        return (
          <CustomMenu
            renderAnchor={({ onClick }) => (
              <Button
                size="small"
                variant="contained"
                color="inherit"
                endIcon={<span style={{ fontSize: 9 }}>▼</span>}
                onClick={onClick}
                disabled={pendingMutation}
                sx={{ bgcolor: "primary.main", color: "primary.contrastText", minWidth: 80 }}
              >
                {t("actionMenuButton")}
              </Button>
            )}
          >
            <MenuItem
              onClick={() => onView(row)}
              disabled={pendingMutation}
            >
              <EyeIcon className="w-4 h-4 ml-2" />
              {t("viewDetails")}
            </MenuItem>
            <MenuItem
              onClick={() => onAccept(row.invitationId)}
              disabled={pendingMutation || !canRespond}
            >
              {t("accept")}
            </MenuItem>
            <MenuItem
              onClick={() => onReject(row.invitationId)}
              disabled={pendingMutation || !canRespond}
            >
              {t("reject")}
            </MenuItem>
          </CustomMenu>
        );
      },
    },
  ];
}
