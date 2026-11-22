import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import ForumGroupsView from "@/modules/forums/forum/groups/ForumGroupsView";

type PageProps = { params: Promise<{ forumId: string }> };

async function ForumGroupsPage({ params }: PageProps) {
  const { forumId } = await params;
  return <ForumGroupsView forumId={forumId} />;
}

export default withServerPermissionsPage(ForumGroupsPage, [
  PERMISSIONS.forum.group.list,
]);
