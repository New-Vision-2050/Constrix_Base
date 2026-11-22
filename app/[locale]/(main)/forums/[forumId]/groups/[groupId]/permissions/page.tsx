import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import GroupSendSettingsView from "@/modules/forums/forum/groups/GroupSendSettingsView";

type PageProps = { params: Promise<{ forumId: string; groupId: string }> };

async function GroupSendSettingsPage({ params }: PageProps) {
  const { forumId, groupId } = await params;
  return <GroupSendSettingsView forumId={forumId} groupId={groupId} />;
}

export default withServerPermissionsPage(GroupSendSettingsPage, [
  PERMISSIONS.forum.group.update,
]);
