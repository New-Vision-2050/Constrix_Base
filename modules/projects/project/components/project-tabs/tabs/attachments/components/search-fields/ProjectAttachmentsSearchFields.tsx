import React from "react";
import { useTranslations } from "next-intl";
import type { ProjectAttachmentsSearchFieldsProps } from "./types";
import { TYPE_OPTIONS, DOCUMENT_TYPE_OPTIONS } from "./constants";
import SearchDateField from "./SearchDateField";
import SearchSelectField from "./SearchSelectField";

const ProjectAttachmentsSearchFields: React.FC<
  ProjectAttachmentsSearchFieldsProps
> = ({ data, onChange, className = "", isLoading = false }) => {
  const t = useTranslations("docs-library.searchFields");

  const handleFieldChange = (
    field: keyof typeof data,
    value: string,
  ) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className={`bg-sidebar rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-medium">{t("search")}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SearchSelectField
          value={data.documentType}
          onChange={(value) => handleFieldChange("documentType", value)}
          options={DOCUMENT_TYPE_OPTIONS}
          placeholder={t("documentType")}
          disabled={isLoading}
        />

        <SearchSelectField
          value={data.type}
          onChange={(value) => handleFieldChange("type", value)}
          options={TYPE_OPTIONS}
          placeholder={t("type")}
          disabled={isLoading}
        />

        <SearchDateField
          value={data.endDate}
          onChange={(value) => handleFieldChange("endDate", value)}
          placeholder={t("endDate")}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default ProjectAttachmentsSearchFields;
