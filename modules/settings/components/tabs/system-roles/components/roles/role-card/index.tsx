import RoleCardTitle from "./card-title";
import PermissionsTable from "./permissions-table";

export default function RoleCard() {
  return (
    <div className="flex flex-col space-y-2 max-w-[553px]">
      <RoleCardTitle />
      <PermissionsTable />
    </div>
  );
}
