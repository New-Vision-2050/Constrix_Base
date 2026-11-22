import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import ForumAdminsView from "@/modules/forums/forum/admins/ForumAdminsView";

type PageProps = { params: Promise<{ forumId: string }> };

async function ForumAdminsPage({ params }: PageProps) {
  const { forumId } = await params;
  return <ForumAdminsView forumId={forumId} />;
}

export default withServerPermissionsPage(ForumAdminsPage, [
  PERMISSIONS.forum.admin.list,
]);
