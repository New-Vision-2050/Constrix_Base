import { Client } from "../../types/Client";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { useState } from "react";
import { apiClient, baseURL } from "@/config/axios-config";
import { toast } from "sonner";
import ToggleControl from "@/modules/clients/components/ToggleControl";

export default function ClientTableStatus({ client }: { client: Client }) {
  const { can } = usePermissions();
  const t = useTranslations("Companies");
  const [loading, setLoading] = useState(false);

  const handleChange = async (checked: boolean) => {
    try {
      setLoading(true);
      await apiClient.post(
        `${baseURL}/users/change-role-status`,
        {
          role_id: 2, //client
          user_id: client.id,
          status: checked ? 1 : 0,
        }
      );

      toast.success("تم تغيير حالة العميل");
    } catch (error) {
      toast.error("حدث خطأ أثناء تغيير حالة العميل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToggleControl
        activeLabel={t("Active")}
        inactiveLabel={t("Inactive")}
        checked={client.status == 1 ? true : false}
        onChange={handleChange}
        disabled={loading || !can(PERMISSIONS.crm.clients.update)}
      />
    </>
  );
}
