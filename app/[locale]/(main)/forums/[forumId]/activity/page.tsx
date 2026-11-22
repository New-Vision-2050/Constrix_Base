import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import ForumActivityView from "@/modules/forums/forum/activity/ForumActivityView";

type PageProps = { params: Promise<{ forumId: string }> };

async function ForumActivityPage({ params }: PageProps) {
  const { forumId } = await params;
  return <ForumActivityView forumId={forumId} />;
}

export default withServerPermissionsPage(ForumActivityPage, [
  PERMISSIONS.forum.activity.list,
]);
