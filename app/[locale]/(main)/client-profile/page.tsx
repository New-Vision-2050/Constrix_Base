import { notFound } from "@i18n/navigation";
import ClientProfileModule from "@/modules/client-profile";
import { usersApi } from "@/services/api/users";

export default async function ClientProfilePage() {

  const { data } = await usersApi.getMe();
  const meData = data?.payload ?? null;

  if (!meData) {
    return notFound();
  }

  const profileData = meData.user ?? meData;
  return <ClientProfileModule profileData={profileData} />;
}

