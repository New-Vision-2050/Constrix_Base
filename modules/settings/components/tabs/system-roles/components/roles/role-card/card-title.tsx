import { Checkbox } from "@/components/ui/checkbox";

export default function RoleCardTitle() {
  return (
    <div className="flex items-center space-x-2 w-full h-[94px] gap-2.5 pt-[26px] pr-[37px] pb-[26px] pl-[37px] rounded-[16px] bg-[hsl(var(--sidebar-background))]">
      <Checkbox id="terms1" />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="terms1"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          المشاريع
        </label>
      </div>
    </div>
  );
}
