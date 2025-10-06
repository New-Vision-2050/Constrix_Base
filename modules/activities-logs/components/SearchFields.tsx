"use client";
import {
  SearchDateField,
  SearchSelectField,
} from "@/modules/docs-library/modules/publicDocs/components/search-fields";
import { LOGS_TYPES_OPTIONS, LOGS_USERS_OPTIONS } from "./dummy-data";
import { Button } from "@/components/ui/button";
import {
  SearchUserActivityLogT,
  useActivitiesLogsCxt,
} from "../context/ActivitiesLogsCxt";

export interface SearchFieldsProps {
  /** Search form data */
  data: SearchUserActivityLogT;
  /** Form data change handler */
  onChange: (data: SearchUserActivityLogT) => void;
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
  const { usersList, currentUserId, isCurrentUserAdmin } =
    useActivitiesLogsCxt();

  const handleReset = () => {
    onChange({
      type: "",
      user_id: "",
      time_from: "",
      time_to: "",
    });
  };

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
          value={!isCurrentUserAdmin ? currentUserId : data.user_id}
          onChange={(value) => handleFieldChange("user_id", value)}
          options={
            usersList
              ? usersList.map((user) => ({ value: user.id, label: user.name }))
              : []
          }
          placeholder={"أختر المستخدم"}
          disabled={isLoading || !isCurrentUserAdmin}
        />

        {/* Date From */}
        <SearchDateField
          value={data.time_from}
          onChange={(value) => handleFieldChange("time_from", value)}
          placeholder={"من التاريخ"}
          disabled={isLoading}
        />

        {/* Date To */}
        <SearchDateField
          value={data.time_to}
          onChange={(value) => handleFieldChange("time_to", value)}
          placeholder={"الى التاريخ"}
          disabled={isLoading}
        />
      </div>
      {/* footer search and reset */}
      <div className="flex items-center justify-end mt-4 gap-4">
        <Button
          onClick={handleReset}
          variant="outline"
          className="bg-yellow-600"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
