import { baseURL } from "@/config/axios-config";
import { ClientProfileData } from "./[id]/types";
import { baseApi } from "@/config/axios/instances/base";
import { notFound } from "next/navigation";
import ClientProfileModule from "@/modules/client-profile";

export default async function ClientProfilePage() {
  // fetch me data
  const meData = await fetchMeData();

  if (!meData) {
    return notFound();
  }

  return <ClientProfileModule profileData={meData} />
}



export async function fetchMeData(): Promise<ClientProfileData | null> {
  try {
    const response = await baseApi.get(`${baseURL}/users/me`);
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}
