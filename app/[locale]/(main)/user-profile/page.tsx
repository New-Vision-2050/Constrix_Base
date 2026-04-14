import UserProfileModule from "@/modules/user-profile/views";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import { getPermissions } from "@/lib/permissions/server/get-permissions";


type UserProfilePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default withServerPermissionsPage(
  async function UserProfilePage({ searchParams: searchParamsPromise }: UserProfilePageProps) {
    const searchParams = await searchParamsPromise;
    const { user: data } = await getPermissions();
    const me = data ?? null;
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