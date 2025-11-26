import ClientProfileModule from "@/modules/client-profile";
import { ClientProfileData } from "./types";
import { notFound } from "next/navigation";
import { baseApi } from "@/config/axios/instances/base";
import { baseURL } from "@/config/axios-config";

export const dynamic = 'force-dynamic';

export default async function ClientProfileDetailPage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const { id, locale } = await params;

  // Fetch user data with the provided ID
  const userData = await fetchUserData(id);

  // If user not found, show 404
  if (!userData) {
    notFound();
  }

  return <ClientProfileModule profileData={userData} />
}

async function fetchUserData(userId: string): Promise<ClientProfileData | null> {
  try {
    const response = await baseApi.get(`${baseURL}/users/${userId}`);
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

