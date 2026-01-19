import { truncateString } from "@/utils/truncate-string";
import TheStatus from "../component/the-status";
import { FounderRow } from "../types";

/**
 * Creates column definitions for the Founder table
 * Handles bilingual content (AR/EN) and status display
 */
export const createColumns = (t: (key: string) => string) => {
  return [
    {
      key: "name",
      name: t("name"),
      sortable: true,
      render: (row: FounderRow) => {
        const name = row.name;
        return <strong className="text-sm">{name}</strong>;
      },
    },
    {
      key: "job_title",
      name: t("jobTitle"),
      sortable: true,
      render: (row: FounderRow) => {
        const jobTitle = row.job_title;
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {jobTitle || "-"}
          </span>
        );
      },
    },
    {
      key: "description",
      name: t("description"),
      sortable: false,
      render: (row: FounderRow) => {
        const description = row.description;
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {description ? truncateString(description ?? "", 40) : "-"}
          </span>
        );
      },
    },
    {
      key: "status",
      name: t("status"),
      sortable: false,
      render: (row: FounderRow) => {
        const isActive = row.status === 1;
        return <TheStatus theStatus={isActive} id={row.id} />;
      },
    },
  ];
};
