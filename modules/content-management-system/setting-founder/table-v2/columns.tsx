import TheStatus from "../component/the-status";
import { FounderRow } from "../types";

/**
 * Creates column definitions for the Founder table
 * Handles bilingual content (AR/EN) and status display
 */
export const createColumns = (t: (key: string) => string, locale: string) => {
  return [
    {
      key: "name",
      name: t("name"),
      sortable: true,
      render: (row: FounderRow) => {
        const name =
          locale === "ar" ? row.name_ar || row.name : row.name_en || row.name;
        return <strong className="text-sm">{name}</strong>;
      },
    },
    {
      key: "job_title",
      name: t("jobTitle"),
      sortable: true,
      render: (row: FounderRow) => {
        const jobTitle =
          locale === "ar"
            ? row.job_title_ar || row.job_title
            : row.job_title_en || row.job_title;
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
        const description =
          locale === "ar"
            ? row.description_ar || row.description
            : row.description_en || row.description;
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {description ? `${description.substring(0, 50)}...` : "-"}
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
