import { Button, Chip, MenuItem, Typography } from "@mui/material";
import type { ProjectInboxRow } from "@/modules/projects/inbox/map-invitation-to-row";
import CustomMenu from "@/components/headless/custom-menu";
import type { ProjectColumnTranslator } from "@/modules/projects/project/views/list/columns";

type InboxTranslator = (key: string) => string;

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
  tShare: InboxTranslator,
  empty: string,
): string {
  const key = status.trim().toLowerCase();
  switch (key) {
    case "pending":
      return tShare("statusPending");
    case "sent":
      return tShare("statusSent");
    case "draft":
    case "under_construction":
      return tShare("statusDraft");
    case "accepted":
    case "approved":
      return tShare("statusAccepted");
    case "rejected":
      return tShare("statusRejected");
    default:
      return status || empty;
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
  tProject: ProjectColumnTranslator;
  tInbox: InboxTranslator;
  tShare: InboxTranslator;
  pendingMutation: boolean;
  onAccept: (invitationId: string) => void;
  onReject: (invitationId: string) => void;
  onView: (row: ProjectInboxRow) => void;
};

export function getInboxColumns({
  tProject,
  tInbox,
  tShare,
  pendingMutation,
  onAccept,
  onReject,
  onView,
}: GetInboxColumnsOptions) {
  return [
    {
      key: "inbox_type_label",
      name: tInbox("columnType"),
      sortable: false,
      render: (row: ProjectInboxRow) => (
        <span>{row.inbox_type_label || tProject("emptyCell")}</span>
      ),
    },
    {
      key: "name",
      name: tInbox("columnName"),
      sortable: false,
      render: (row: ProjectInboxRow) => (
        <span className="font-medium">{row.name || tProject("emptyCell")}</span>
      ),
    },
    {
      key: "sender_company_name",
      name: tInbox("columnSenderCompany"),
      sortable: false,
      render: (row: ProjectInboxRow) => (
        <span>
          {row.sender_company_name?.trim()
            ? row.sender_company_name
            : tProject("emptyCell")}
        </span>
      ),
    },
    {
      key: "reference_display",
      name: tInbox("columnReference"),
      sortable: false,
      render: (row: ProjectInboxRow) => (
        <span>{row.reference_display || tProject("emptyCell")}</span>
      ),
    },
    {
      key: "representative_name",
      name: tInbox("columnRepresentative"),
      sortable: false,
      render: (row: ProjectInboxRow) => (
        <span>
          {row.representative_name?.trim()
            ? row.representative_name
            : tProject("emptyCell")}
        </span>
      ),
    },
    {
      key: "sent_at_raw",
      name: tInbox("columnDateSent"),
      sortable: false,
      render: (row: ProjectInboxRow) => {
        const formatted = formatInboxSentDate(row.sent_at_raw);
        return (
          <span>
            {formatted.trim() ? formatted : tProject("emptyCell")}
          </span>
        );
      },
    },
    {
      key: "invitation_status",
      name: tInbox("columnStatus"),
      sortable: false,
      render: (row: ProjectInboxRow) => {
        const label = inboxShareStatusLabel(
          row.invitation_status,
          tShare,
          tProject("emptyCell"),
        );
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
      name: tProject("tableActions"),
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
                sx={{ bgcolor: "#3f3f5a", color: "#fff", minWidth: 80 }}
              >
                {tInbox("actionMenu")}
              </Button>
            )}
          >
            <MenuItem
              onClick={() => onView(row)}
              disabled={pendingMutation}
            >
              {tInbox("viewDetails")}
            </MenuItem>
            <MenuItem
              onClick={() => onAccept(row.invitationId)}
              disabled={pendingMutation || !canRespond}
            >
              {tInbox("accept")}
            </MenuItem>
            <MenuItem
              onClick={() => onReject(row.invitationId)}
              disabled={pendingMutation || !canRespond}
            >
              {tInbox("reject")}
            </MenuItem>
          </CustomMenu>
        );
      },
    },
  ];
}
