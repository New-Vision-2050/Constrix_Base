"use client";
import { useState } from "react";
import { apiClient, baseURL } from "@/config/axios-config";
import { toast } from "sonner";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import ToggleControl from "@/modules/clients/components/ToggleControl";
import { ModelsTypes } from "@/modules/users/components/users-sub-entity-form/constants/ModelsTypes";

const ENDPOINT_MAP: Record<string, string> = {
  [ModelsTypes.EMPLOYEE]: "company-users/employees",
  [ModelsTypes.CLIENT]: "company-users/clients",
  [ModelsTypes.BROKER]: "company-users/brokers",
};

interface SubEntityStatusSwitchProps {
  id: string;
  userId: string;
  status?: number | null;
  entityType: string;
}

export default function SubEntityStatusSwitch({
  id,
  userId,
  status,
  entityType,
}: SubEntityStatusSwitchProps) {
  const { can } = usePermissions();
  const [loading, setLoading] = useState(false);

  const endpoint = ENDPOINT_MAP[entityType];

  const handleChange = async (checked: boolean) => {
    if (!endpoint) return;
    try {
      setLoading(true);
      await apiClient.patch(`${baseURL}/${endpoint}/${userId}/status`, {
        status: checked ? 1 : 0,
      });
      toast.success("تم تغيير الحالة بنجاح");
    } catch {
      toast.error("حدث خطأ أثناء تغيير الحالة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToggleControl
      activeLabel="نشط"
      inactiveLabel="غير نشط"
      checked={status != null ? status === 1 : true}
      onChange={handleChange}
      disabled={loading || !can(PERMISSIONS.subEntity.update)}
    />
  );
}
