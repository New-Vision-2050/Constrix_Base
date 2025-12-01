import UserProfileModule from "@/modules/user-profile/views";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";


type UserProfilePageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default withServerPermissionsPage(
  async function UserProfilePage({ searchParams }: UserProfilePageProps) {
    const userId = searchParams.id as string;
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