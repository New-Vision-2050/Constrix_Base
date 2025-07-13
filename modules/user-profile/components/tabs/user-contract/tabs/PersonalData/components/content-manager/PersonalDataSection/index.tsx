import PersonalDataSectionPersonalForm from "./components/personal-user-data";
import ConnectionDataSectionPersonalForm from "./components/connection-user-data";
import IdentityDataSectionPersonalForm from "./components/Identity-user-data";
import PassportDataSectionPersonalForm from "./components/passport-user-data";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

export default function PersonalDataSection() {
  const permissions = can(PERMISSION_ACTIONS.VIEW, [PERMISSION_SUBJECTS.USER_PROFILE_DATA, PERMISSION_SUBJECTS.USER_PROFILE_CONTACT, PERMISSION_SUBJECTS.USER_PROFILE_IDENTITY]) as {
    USER_PROFILE_DATA: boolean;
    USER_PROFILE_CONTACT: boolean;
    USER_PROFILE_IDENTITY: boolean;
  };
  const { user } = useUserProfileCxt();
  const identity = user?.country?.id === user?.company?.country_id;

  return (
    <div className="flex flex-col gap-6">
      {permissions.USER_PROFILE_DATA && <PersonalDataSectionPersonalForm />}
      {permissions.USER_PROFILE_CONTACT && (
        <ConnectionDataSectionPersonalForm />
      )}

      {identity ? (
        <>
          {permissions.USER_PROFILE_IDENTITY && <IdentityDataSectionPersonalForm />}
        </>
      ) : (
        <PassportDataSectionPersonalForm />
      )}
    </div>
  );
}
