import PermissionsList from "./permissions-list";

export default function RoleCardContent() {
  return (
    <div className="flex items-center  w-full gap-2.5 pt-[26px] pr-[37px] pb-[26px] pl-[37px] rounded-[16px] bg-[hsl(var(--sidebar-background))]">
      <PermissionsList />
    </div>
  );
}
