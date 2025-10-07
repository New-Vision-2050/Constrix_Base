import { useTranslations } from "next-intl";

/**
 * Table header component
 * Defines column headers for the documents table
 */
export const TableHeader = () => {
  const t = useTranslations("docs-library.publicDocs.table");

  const headers = [
    { key: "checkbox", label: "", width: "w-12" },
    { key: "file", label: t("doc_name"), width: "flex-1" },
    { key: "sortedBy", label: t("sortedBy"), width: "w-32" },
    { key: "fileSize", label: t("fileSize"), width: "w-24" },
    { key: "docsCount", label: t("docsCount"), width: "w-28" },
    { key: "lastActivity", label: t("lastActivity"), width: "w-36" },
    { key: "actions", label: t("actions"), width: "w-20" },
  ];

  return (
    <thead className="bg-muted/50">
      <tr>
        {headers.map((header) => (
          <th
            key={header.key}
            className={`px-4 py-3 text-right text-sm font-medium text-muted-foreground ${header.width}`}
          >
            {header.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};
