import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import ForumMembersView from "@/modules/forums/forum/members/ForumMembersView";

type PageProps = { params: Promise<{ forumId: string }> };

async function ForumMembersPage({ params }: PageProps) {
  const { forumId } = await params;
  return <ForumMembersView forumId={forumId} />;
}

export default withServerPermissionsPage(ForumMembersPage, [
  PERMISSIONS.forum.member.list,
]);
