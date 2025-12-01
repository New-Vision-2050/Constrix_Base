"use client";

import { UserProfileCxtProvider } from "../context/user-profile-cxt";
import UserProfileEntryPoint from "../components/entry-point";

export default function UserProfileModule({ userId, companyId }: { userId: string, companyId: string }) {
  console.log("searchParams1010", userId, companyId);
  return (
    <UserProfileCxtProvider>
      <UserProfileEntryPoint />
    </UserProfileCxtProvider>
  );
}
