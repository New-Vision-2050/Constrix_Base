import { SocialLink } from "@/services/api/company-dashboard/communication-settings/types/response";
import Image from "next/image";
import { truncateString } from "@/utils/truncate-string";

export const getSocialLinksColumns = (t: (key: string) => string) => [
  {
    key: "icon_url",
    name: t("socialIcon") || "Social Icon",
    sortable: false,
    render: (row: SocialLink) =>
      row.icon_url ? (
        <Image
          src={row.icon_url}
          alt="Social Icon"
          width={40}
          height={40}
          className="object-cover rounded"
          style={{ width: "50%", height: "auto", maxWidth: "50px" }}
        />
      ) : (
        <span className="text-gray-400">-</span>
      ),
  },
  {
    key: "type",
    name: t("type") || "Type",
    sortable: false,
    render: (row: SocialLink) => <strong>{row.type?.name ?? "-"}</strong>,
  },
  {
    key: "link",
    name: t("url") || "URL",
    sortable: false,
    render: (row: SocialLink) => (
      <span>{truncateString(row.link ?? "-", 30)}</span>
    ),
  },
];
