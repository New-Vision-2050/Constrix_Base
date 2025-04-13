import RolesList from "./components/roles";
import RolesSearchSection from "./components/search-bar";

export default function SystemRoles() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <RolesSearchSection />
      <RolesList />
    </div>
  );
}
