"use client";
import { Input } from "@/components/ui/input";
import { SetRoleForm } from "../set-role";

export default function RolesSearchSection() {
  return (
    <div className="w-full gap-2.5 pt-[26px] pr-[37px] pb-[26px] pl-[37px] rounded-[16px] bg-[hsl(var(--sidebar-background))] flex gap-4">
      <div className="flex-grow">
        <Input type="text" label="أسم الدور" />
      </div>

      <SetRoleForm />
    </div>
  );
}
