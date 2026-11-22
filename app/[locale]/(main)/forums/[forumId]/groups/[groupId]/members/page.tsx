import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import GroupMembersView from "@/modules/forums/forum/groups/GroupMembersView";

type PageProps = { params: Promise<{ forumId: string; groupId: string }> };

async function GroupMembersPage({ params }: PageProps) {
  const { forumId, groupId } = await params;
  return <GroupMembersView forumId={forumId} groupId={groupId} />;
}

export default withServerPermissionsPage(GroupMembersPage, [
  PERMISSIONS.forum.member.list,
]);
