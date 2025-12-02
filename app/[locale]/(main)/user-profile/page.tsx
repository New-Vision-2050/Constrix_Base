import UserProfileModule from "@/modules/user-profile/views";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import { fetchMeData } from "../client-profile/page";


type UserProfilePageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default withServerPermissionsPage(
  async function UserProfilePage({ searchParams }: UserProfilePageProps) {
    const me = await fetchMeData();
    const meUserId = me?.id;
    const userId = Boolean(searchParams.id) ? searchParams.id as string : meUserId as string;
    const companyId = searchParams.company_id as string;
    return <UserProfileModule userId={userId} companyId={companyId} />;
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