import Can from "@/lib/permissions/client/Can";
import { AddNewPrivilege } from "./AddNewPrivilege";
import PrivilegesFormsList from "./PrivilegesFormsList";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function PrivilegesAndAllowances() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold">الامتيازات و البدلات</p>
        <Can check={[PERMISSIONS.profile.privileges.create]}>
          <AddNewPrivilege />
        </Can>
      </div>
      <Can check={[PERMISSIONS.profile.privileges.view]}>
        <PrivilegesFormsList />
      </Can>
    </div>
  );
}
