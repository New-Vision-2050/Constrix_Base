import TabsManager from "@/modules/settings/views/TabsManager";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";

export default withServerPermissionsPage(
  function AuthSettingsPage() {
    return (
      <div className="px-6">
        <div className="w-full flex items-center">
          <TabsManager />
        </div>
      </div>
    );
  },
  [
    Object.values(PERMISSIONS.companyAccessProgram).flatMap((p) =>
      Object.values(p)
    ),
  ]
);
