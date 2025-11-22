"use client";

import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { CompanyDashboardServicesApi } from "@/services/api/company-dashboard/services";
import { useTableReload } from "@/modules/table";

interface TheStatusProps {
  theStatus: "active" | "inActive";
  id: string;
  field?: "is_active" | "is_featured";
}

export default function TheStatus({ 
  theStatus, 
  id,
  field = "is_active" 
}: TheStatusProps) {
  const t = useTranslations("content-management-system.services");
  const { reloadTable } = useTableReload("service-list-table");

  const handleToggle = async (checked: boolean) => {
    try {
      // For now, we'll use a generic update endpoint
      // You may need to adjust this based on your API
      await CompanyDashboardServicesApi.update(id, {
        [field]: checked,
      } as any);
      toast.success(t("table.statusUpdated") || "Status updated successfully");
      reloadTable();
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

