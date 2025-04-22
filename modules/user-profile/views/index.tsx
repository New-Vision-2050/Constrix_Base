"use client";

import { UserProfileCxtProvider } from "../context/user-profile-cxt";
import UserProfileEntryPoint from "../components/entry-point";

export default function UserProfileModule() {
  return (
    <UserProfileCxtProvider>
      <UserProfileEntryPoint />
    </UserProfileCxtProvider>
  );
}
