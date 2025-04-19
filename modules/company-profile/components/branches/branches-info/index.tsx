"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import BranchInfo from "../branch-card";
import { SheetFormBuilder } from "@/modules/form-builder";
import { addNewBranchFormConfig } from "./add-new-branch-form-config";

const BranchesInfo = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl">الفروع</h3>
        <SheetFormBuilder
          config={addNewBranchFormConfig()}
          trigger={<Button>اضافة فرع</Button>}
        />{" "}
      </div>
      <BranchInfo />
    </div>
  );
};

export default BranchesInfo;
