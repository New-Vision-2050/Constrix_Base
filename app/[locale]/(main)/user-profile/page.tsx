import UserProfileModule from "@/modules/user-profile/views";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";

export default withServerPermissionsPage(
  function UserProfilePage() {
    return <UserProfileModule />;
  },
  [
    [
      ...Object.values(PERMISSIONS.userProfile).flatMap((p) =>
        Object.values(p)
      ),
      ...Object.values(PERMISSIONS.profile).flatMap((p) => Object.values(p)),
    ],
  ]
);
