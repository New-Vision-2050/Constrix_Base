import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import TermsSettingsView from "./TermsSettingsView";

export default function TermsSettings() {
  return (
    <Can check={[PERMISSIONS.crm.termSettings.list]}>
      <TermsSettingsView />
    </Can>
  );
}