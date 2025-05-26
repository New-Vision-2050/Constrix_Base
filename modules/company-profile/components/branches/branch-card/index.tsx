import React from "react";
import { Card } from "@/components/ui/card";
import { MapPin, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "next-intl";
import { Branch } from "@/modules/company-profile/types/company";
import { SheetFormBuilder } from "@/modules/form-builder";
import { addNewBranchFormConfig } from "../branches-info/add-new-branch-form-config";
import { useModal } from "@/hooks/use-modal";
import ChangeBranchDialog from "./change-branch-dialog";
import { baseURL } from "@/config/axios-config";
import { updateBranchFormConfig } from "../branches-info/update-branch-form-config";

interface BranchCardProps {
  branch: Branch;
  branches: Branch[];
  className?: string;
}

const BranchCard = ({ branch, branches, className = "" }: BranchCardProps) => {
  const [isOpen, handleOpen, handleClose] = useModal();
  const local = useLocale();
  const isRTL = local === "ar";
  const isMainBranch = branch.parent_id === null;
  const isMultipleBranch = branches.length > 1;

  const detailRows = [
    { label: "مدير الفرع", value: branch.manager?.name ?? "-" },
    { label: "عدد الموظفين", value: branch.user_count ?? 0 },
    { label: "عدد الاقسام", value: branch.department_count ?? 0 },
    { label: "البريد الالكتروني", value: branch.email ?? "—" },
    { label: "رقم الجوال", value: branch.phone ?? "—" },
  ];

  return (
    <div className={`w-full p-4 rounded-md ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col items-start">
          <h2 className="text-2xl font-bold mb-1">{branch.name}</h2>
          <div className="flex items-center">
            <MapPin className="ml-1 text-pink-500" size={18} />
            <span>{branch.country_name}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            className={cn(
              "px-4 py-1 rounded-full",
              isMainBranch
                ? "bg-[#FFE8F3] text-primary hover:bg-[#FFE8F3] "
                : "bg-[#463D5D] text-primary hover:bg-[#463D5D] "
            )}
          >
            {isMainBranch ? "رئيسي" : "فرعي"}
          </Badge>
          <DropdownMenu dir={isRTL ? "rtl" : "ltr"}>
            <DropdownMenuTrigger className="text-foreground">
              <MoreVertical size={24} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleOpen}
                className="text-start block"
              >
                تعديل
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Card className="border bg-transparent rounded-lg overflow-hidden">
        <div className="flex flex-col">
          {detailRows.map((row, index) => (
            <div key={index} className="flex group">
              <div className="w-1/3 bg-background p-4 text-right font-medium">
                {row.label}
              </div>
              <div className="w-2/3 p-4 text-right border-b group-last:border-b-0">
                {row.value}
              </div>
            </div>
          ))}
        </div>
      </Card>
      <SheetFormBuilder
        config={{
          ...updateBranchFormConfig(branches, branch, isMainBranch),
        }}
        isOpen={isOpen}
        onOpenChange={handleClose}
      />
      {isMultipleBranch && isMainBranch && (
        <ChangeBranchDialog branches={branches} branchId={branch.id} />
      )}
    </div>
  );
};

const BranchInfo = ({ branches }: { branches: Branch[] }) => {
  return (
    <div className="bg-sidebar grid grid-cols-2">
      {branches.map((branch) => (
        <BranchCard key={branch.id} branch={branch} branches={branches} />
      ))}
    </div>
  );
};

export default BranchInfo;
