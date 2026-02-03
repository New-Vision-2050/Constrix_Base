"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import BranchInfo from "../branch-card";
import { SheetFormBuilder } from "@/modules/form-builder";
import { addNewBranchFormConfig } from "./add-new-branch-form-config";
import { Branch } from "@/modules/company-profile/types/company";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import Can from "@/lib/permissions/client/Can";
import { useTranslations } from "next-intl";
const BranchesInfo = ({ branches,handleBranchesRefetch }: { branches: Branch[],handleBranchesRefetch: () => void }) => {
 const t = useTranslations("UserProfile.header.branches");
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl">{t("branches")}</h3>
        <Can check={[PERMISSIONS.companyProfile.branch.create]}>
          <SheetFormBuilder
            config={addNewBranchFormConfig(branches)}
            trigger={<Button>{t("addBranch")}</Button>}
          />
        </Can>
      </div>
      <BranchInfo branches={branches} handleBranchesRefetch={handleBranchesRefetch} />
    </div>
  );
};

export default BranchesInfo;
