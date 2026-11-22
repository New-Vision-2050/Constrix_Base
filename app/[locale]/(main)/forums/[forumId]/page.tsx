import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import ForumOverviewView from "@/modules/forums/forum/overview/ForumOverviewView";

type PageProps = { params: Promise<{ forumId: string }> };

async function ForumOverviewPage({ params }: PageProps) {
  const { forumId } = await params;
  return <ForumOverviewView forumId={forumId} />;
}

export default withServerPermissionsPage(ForumOverviewPage, [
  PERMISSIONS.forum.view,
]);
