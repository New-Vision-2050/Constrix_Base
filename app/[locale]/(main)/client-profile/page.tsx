import { ClientProfileData } from "./[id]/types";
import { notFound } from "@i18n/navigation";
import ClientProfileModule from "@/modules/client-profile";
import { fetchUserMe } from "@/lib/user/fetch-user-me";

export default async function ClientProfilePage() {
  const meData = await fetchMeData();

  if (!meData) {
    return notFound();
  }

  return <ClientProfileModule profileData={meData} />;
}

export async function fetchMeData(): Promise<ClientProfileData | null> {
  const payload = await fetchUserMe();
  return payload as ClientProfileData | null;
}
