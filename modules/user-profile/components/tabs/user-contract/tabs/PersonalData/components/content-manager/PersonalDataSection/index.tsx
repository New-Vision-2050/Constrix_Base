import PersonalDataSectionPersonalForm from "./components/personal-user-data";
import ConnectionDataSectionPersonalForm from "./components/connection-user-data";
import IdentityDataSectionPersonalForm from "./components/Identity-user-data";
import PassportDataSectionPersonalForm from "./components/passport-user-data";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function PersonalDataSection() {
  const { user } = useUserProfileCxt();
  const identity = user?.country?.id === user?.company?.country_id;

  return (
    <div className="flex flex-col gap-6">
      <PersonalDataSectionPersonalForm />

      <ConnectionDataSectionPersonalForm />

      {identity && <IdentityDataSectionPersonalForm />}

      {!identity && <PassportDataSectionPersonalForm />}
    </div>
  );
}
