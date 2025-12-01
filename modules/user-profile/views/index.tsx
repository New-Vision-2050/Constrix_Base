"use client";

import { UserProfileCxtProvider } from "../context/user-profile-cxt";
import UserProfileEntryPoint from "../components/entry-point";

export default function UserProfileModule({ userId, companyId }: { userId: string, companyId: string }) {
  return (
    <UserProfileCxtProvider userId={userId} companyId={companyId}>
      <UserProfileEntryPoint userId={userId} companyId={companyId} />
    </UserProfileCxtProvider>
  );
}
