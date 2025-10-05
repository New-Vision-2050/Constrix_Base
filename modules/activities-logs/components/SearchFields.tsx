"use client";
import {
  SearchDateField,
  SearchSelectField,
} from "@/modules/docs-library/modules/publicDocs/components/search-fields";
import { LOGS_TYPES_OPTIONS, LOGS_USERS_OPTIONS } from "./dummy-data";
import { Button } from "@/components/ui/button";

export interface SearchFormData {
  type?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
}
export interface SearchFieldsProps {
  /** Search form data */
  data: SearchFormData;
  /** Form data change handler */
  onChange: (data: SearchFormData) => void;
  /** Custom className */
  className?: string;
  /** Loading state */
  isLoading?: boolean;
}

export default function ActivitiesLogsSearchFields({
  data,
  onChange,
  className = "",
  isLoading = false,
}: SearchFieldsProps) {
  // Handle field changes while maintaining immutability
  const handleFieldChange = (field: keyof typeof data, value: string) => {
    const newData = {
      ...data,
      [field]: value,
    };
    onChange(newData);
  };
  return (
    <div className={`bg-sidebar rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">بحث</h2>
      </div>
      {/* Search fields grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Type */}
        <SearchSelectField
          value={data.type}
          onChange={(value) => handleFieldChange("type", value)}
          options={LOGS_TYPES_OPTIONS}
          placeholder={"أختر الحالة"}
          disabled={isLoading}
        />

        {/* User ID */}
        <SearchSelectField
          value={data.userId}
          onChange={(value) => handleFieldChange("userId", value)}
          options={LOGS_USERS_OPTIONS}
          placeholder={"أختر المستخدم"}
          disabled={isLoading}
        />

        {/* Date From */}
        <SearchDateField
          value={data.dateFrom}
          onChange={(value) => handleFieldChange("dateFrom", value)}
          placeholder={"من التاريخ"}
          disabled={isLoading}
        />

        {/* Date To */}
        <SearchDateField
          value={data.dateTo}
          onChange={(value) => handleFieldChange("dateTo", value)}
          placeholder={"الى التاريخ"}
          disabled={isLoading}
        />
      </div>
      {/* footer search and reset */}
      <div className="flex items-center justify-end mt-4 gap-4">
        <Button variant="default">Search</Button>
        <Button variant="outline">Reset</Button>
      </div>
    </div>
  );
}
