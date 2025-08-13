"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import BranchInfo from "../branch-card";
import { SheetFormBuilder } from "@/modules/form-builder";
import { addNewBranchFormConfig } from "./add-new-branch-form-config";
import { Branch } from "@/modules/company-profile/types/company";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import Can from "@/lib/permissions/client/Can";

const BranchesInfo = ({ branches }: { branches: Branch[] }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl">الفروع</h3>
        <Can check={[PERMISSIONS.companyProfile.branch.create]}>
          <SheetFormBuilder
            config={addNewBranchFormConfig(branches)}
            trigger={<Button>اضافة فرع</Button>}
          />
        </Can>
      </div>
      <BranchInfo branches={branches} />
    </div>
  );
};

export default BranchesInfo;
