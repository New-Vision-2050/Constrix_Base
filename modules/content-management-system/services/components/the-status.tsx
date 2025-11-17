"use client";

import { Switch } from "@/components/ui/switch";
import { apiClient, baseURL } from "@/config/axios-config";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface TheStatusProps {
  theStatus: "active" | "inActive";
  id: string;
}

export default function TheStatus({ theStatus, id }: TheStatusProps) {
  const t = useTranslations("content-management-system.services");

  const handleToggle = async (checked: boolean) => {
    try {
      await apiClient.put(
        `${baseURL}/company-dashboard/services/${id}/toggle-status`,
        {
          is_active: checked,
        }
      );
      toast.success(t("table.statusUpdated") || "Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(t("table.statusUpdateError") || "Failed to update status");
    }
  };

  return (
    <Switch
      checked={theStatus === "active"}
      onCheckedChange={handleToggle}
    />
  );
}

