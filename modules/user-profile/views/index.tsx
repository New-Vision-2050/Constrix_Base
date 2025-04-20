"use client";

import UserProfileTabs from "../components/tabs";
import UserProfileHeader from "../components/profile-header";
import StatisticsCardsSection from "../components/statistics-cards";
import { UserProfileCxtProvider } from "../context/user-profile-cxt";


export default function UserProfileModule() {
  return (
    <UserProfileCxtProvider>
      <div className="flex flex-col gap-12  p-12">
        {/* header */}
        <UserProfileHeader />
        {/* Statistics cards */}
        <StatisticsCardsSection />
        {/* tabs */}
        <UserProfileTabs />
      </div>
    </UserProfileCxtProvider>
  );
}
