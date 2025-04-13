import PermissionsList from "./permissions-list";
import PermissionsTableHeader from "./permissions-table-header";

export default function PermissionsTable() {
  return (
    <table className="w-full gap-2.5 pt-[26px] pr-[37px] pb-[26px] pl-[37px] rounded-[16px] bg-[hsl(var(--sidebar-background))]">
      <PermissionsTableHeader />
      <PermissionsList />
    </table>
  );
}
