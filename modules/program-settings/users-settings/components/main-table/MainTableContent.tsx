"use client";
import React from "react";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { UpdateMainTableAttributes } from "../../config/UpdateMainTableAttributes";
import { useAllowedAttributes } from "../../query/useAllowedAttributes";

const MainTableContent = () => {
  const { data, isLoading, isError, error, isSuccess } =
    useAllowedAttributes("users");

  if (isLoading) {
    return <div>Loading allowed attributes...</div>;
  }

  if (isError) {
    console.log("Failed to load attributes:", error);
    return <div className="text-red-500">Failed to load data.</div>;
  }

  if (isSuccess && (!data || !data.payload)) {
    return <div className="text-yellow-600">No attribute data found.</div>;
  }

  const payload = data.payload;
  const config = UpdateMainTableAttributes("users", payload);

  return (
    <div className="grid grid-cols-2">
      <FormContent config={config} />
    </div>
  );
};

export default MainTableContent;
