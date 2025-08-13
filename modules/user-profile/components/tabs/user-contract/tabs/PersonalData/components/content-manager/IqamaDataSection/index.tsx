import Can from "@/lib/permissions/client/Can";
import UserIqamaBorderNumber from "./components/border-number";
import UserIqamaData from "./components/iqama-data";
import UserIqamaWorkLicenseData from "./components/work-license";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function IqamaDataSection() {
  return (
    <div className="flex flex-col gap-8">
      <Can check={[PERMISSIONS.profile.borderNumber.view]}>
        <UserIqamaBorderNumber />
      </Can>
      {/* <Can check={[PERMISSIONS.profile.iqama.view]}> */}
      <UserIqamaData />
      {/* </Can> */}
      <Can check={[PERMISSIONS.profile.workLicense.view]}>
        <UserIqamaWorkLicenseData />
      </Can>
    </div>
  );
}
