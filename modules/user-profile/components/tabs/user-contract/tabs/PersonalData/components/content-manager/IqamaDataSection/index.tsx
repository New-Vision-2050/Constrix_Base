import { can } from "@/hooks/useCan";
import UserIqamaBorderNumber from "./components/border-number";
import UserIqamaData from "./components/iqama-data";
import UserIqamaWorkLicenseData from "./components/work-license";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";
import CanSeeContent from "@/components/shared/CanSeeContent";

export default function IqamaDataSection() {
  const permissions = can(PERMISSION_ACTIONS.VIEW , [PERMISSION_SUBJECTS.PROFILE_BORDER_NUMBER , PERMISSION_SUBJECTS.PROFILE_RESIDENCE_INFO, PERMISSION_SUBJECTS.PROFILE_WORK_LICENSE]) as {
    PROFILE_BORDER_NUMBER: boolean;
    PROFILE_RESIDENCE_INFO: boolean;
    PROFILE_WORK_LICENSE: boolean;
  };
  const canViewIqamaSection = permissions.PROFILE_BORDER_NUMBER || permissions.PROFILE_RESIDENCE_INFO || permissions.PROFILE_WORK_LICENSE;

  return (
    <CanSeeContent canSee={canViewIqamaSection}>
      <div className="flex flex-col gap-8">
      {permissions.PROFILE_BORDER_NUMBER && <UserIqamaBorderNumber />}
      {permissions.PROFILE_RESIDENCE_INFO && <UserIqamaData />}
      {permissions.PROFILE_WORK_LICENSE && <UserIqamaWorkLicenseData />}
      </div>
    </CanSeeContent>
  );
}
