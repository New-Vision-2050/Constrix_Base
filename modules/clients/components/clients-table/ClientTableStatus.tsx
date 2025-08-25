import { Label } from "@/components/ui/label";
import { Client } from "../../types/Client";
import { useTranslations } from "next-intl";
import { Switch } from "@/components/ui/switch";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import ToggleControl from "./ToggleControl";

export default function ClientTableStatus({ client }: { client: Client }) {
  const t = useTranslations("Companies");
  const { can } = usePermissions();

  const handleChange = (checked: boolean) => {
    console.log(checked);
  };

  return (
    <>
      <ToggleControl
        label={t("Active")}
        checked={client.status == 1 ? true : false}
        onChange={handleChange}
        disabled={false}
        // disabled={!can(PERMISSIONS.client.update)}
      />
    </>
  );
}
