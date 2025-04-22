"use client";
import { UserDashboardCxtProvider } from "../context/user-dashboard-cxt";
import DashboardEntryPoint from "../components/entry-point";

export default function UserDashboardModule() {
  return (
    <UserDashboardCxtProvider>
      <DashboardEntryPoint />
    </UserDashboardCxtProvider>
  );
}
