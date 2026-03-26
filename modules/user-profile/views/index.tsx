"use client";

import { UserProfileCxtProvider } from "../context/user-profile-cxt";
import UserProfileEntryPoint from "../components/entry-point";
import { ConnectionDataCxtProvider } from "../components/tabs/user-contract/tabs/PersonalData/components/content-manager/connectionDataSection/context/ConnectionDataCxt";

export default function UserProfileModule({ userId, companyId }: { userId: string, companyId: string }) {
  return (
    <UserProfileCxtProvider userId={userId} companyId={companyId}>
      <ConnectionDataCxtProvider>
        <UserProfileEntryPoint userId={userId} companyId={companyId} />
      </ConnectionDataCxtProvider>
    </UserProfileCxtProvider>
  );
}
