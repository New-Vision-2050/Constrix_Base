import { Suspense } from "react";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import CreateAnnouncementView from "@/modules/forums/components/announcements/CreateAnnouncementView";

export default withServerPermissionsPage(
  function CreateAnnouncementPage() {
    // The view reads `?id=` with `useSearchParams`, which needs a boundary.
    return (
      <Suspense>
        <CreateAnnouncementView />
      </Suspense>
    );
  },
  [PERMISSIONS.forum.announcement.create],
);
