import { baseURL } from "@/config/axios-config";
import { ClientProfileData } from "./[id]/types";
import { baseApi } from "@/config/axios/instances/base";
import { notFound } from "@i18n/navigation";
import ClientProfileModule from "@/modules/client-profile";

export default async function ClientProfilePage() {
  // fetch me data
  const meData = await fetchMeData();

  if (!meData) {
    return notFound();
  }

  return <ClientProfileModule profileData={meData} />;
}

export async function fetchMeData(): Promise<ClientProfileData | null> {
  try {
    // Check if we're in server environment and have proper headers
    const response = await baseApi.get(`${baseURL}/users/me`, {
      headers: {
        'Cache-Control': 'no-cache',
      }
    });
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Return null instead of throwing to prevent layout crashes
    return null;
  }
}
