import UserProfileHeader from "../components/profile-header";

export default function UserDashboardModule() {
  return (
    <div className="flex flex-col gap-12 container p-12">
      {/* header */}
      <UserProfileHeader />
      {/* row 2 */}
      <div className="flex">Profile Content</div>
    </div>
  );
}
