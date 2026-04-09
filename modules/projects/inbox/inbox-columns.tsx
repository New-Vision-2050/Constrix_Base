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

function inboxShareStatusLabel(status: string): string {
  const key = status.trim().toLowerCase();
  switch (key) {
    case "pending":
      return "بانتظار الرد";
    case "sent":
      return "تم الإرسال";
    case "draft":
    case "under_construction":
      return "تحت الإنشاء";
    case "accepted":
    case "approved":
      return "مقبول";
    case "rejected":
      return "مرفوض";
    default:
      return status || "—";
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
  pendingMutation: boolean;
  onAccept: (invitationId: string) => void;
  onReject: (invitationId: string) => void;
  onView: (row: ProjectInboxRow) => void;
};

export function getInboxColumns({
  pendingMutation,
  onView,
}: GetInboxColumnsOptions) {
  return [
    {
      key: "inbox_type_label",
      name: "النوع",
      sortable: false,
      render: (row: ProjectInboxRow) => (
        <span>{row.inbox_type_label || "—"}</span>
      ),
    },
    {
      key: "name",
      name: "العنوان",
      sortable: false,
      render: (row: ProjectInboxRow) => (
        <span className="font-medium">{row.name || "—"}</span>
      ),
    },
    {
      key: "sender_company_name",
      name: "الجهة المراسلة",
      sortable: false,
      render: (row: ProjectInboxRow) => (
        <span>
          {row.sender_company_name?.trim()
            ? row.sender_company_name
            : "—"}
        </span>
      ),
    },
    {
      key: "reference_display",
      name: "المرجع",
      sortable: false,
      render: (row: ProjectInboxRow) => (
        <span>{row.reference_display || "—"}</span>
      ),
    },
    {
      key: "representative_name",
      name: "الممثل",
      sortable: false,
      render: (row: ProjectInboxRow) => (
        <span>
          {row.representative_name?.trim()
            ? row.representative_name
            : "—"}
        </span>
      ),
    },
    {
      key: "sent_at_raw",
      name: "تاريخ الإرسال",
      sortable: false,
      render: (row: ProjectInboxRow) => {
        const formatted = formatInboxSentDate(row.sent_at_raw);
        return (
          <span>
            {formatted.trim() ? formatted : "—"}
          </span>
        );
      },
    },
    {
      key: "invitation_status",
      name: "الحالة",
      sortable: false,
      render: (row: ProjectInboxRow) => {
        const label = inboxShareStatusLabel(row.invitation_status);
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
      name: "الإجراءات",
      sortable: false,
      render: (row: ProjectInboxRow) => {
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
                إجراء
              </Button>
            )}
          >
            <MenuItem
              onClick={() => onView(row)}
              disabled={pendingMutation}
            >
              <EyeIcon className="w-4 h-4 ml-2" />
              عرض 
            </MenuItem>
          </CustomMenu>
        );
      },
    },
  ];
}
