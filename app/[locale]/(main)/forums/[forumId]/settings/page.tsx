import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import ForumSettingsView from "@/modules/forums/forum/settings/ForumSettingsView";

type PageProps = { params: Promise<{ forumId: string }> };

async function ForumSettingsPage({ params }: PageProps) {
  const { forumId } = await params;
  return <ForumSettingsView forumId={forumId} />;
}

export default withServerPermissionsPage(ForumSettingsPage, [
  PERMISSIONS.forum.update,
]);
