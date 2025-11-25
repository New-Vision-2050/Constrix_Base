import ClientProfileModule from "@/modules/client-profile";
import { ClientProfileData } from "./types";

export const dynamic = 'force-dynamic';

export default async function ClientProfilePage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const { id, locale } = await params;

  const userData = await fetchUserData(id);

  return <ClientProfileModule profileData={userData} />
}

async function fetchUserData(userId: string): Promise<ClientProfileData> {
  try {
    return {
      id: userId,
      name: `User ${userId}`,
      email: `user${userId}@example.com`,
      phone: `1234567890`,
      branches: [],
      status: 1,
      broker_id: userId,
      company_name: `Company ${userId}`,
      company_representative_name: `Representative ${userId}`,
      registration_number: `1234567890`,
      residence: `1234567890`,
      type: 1,
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}
