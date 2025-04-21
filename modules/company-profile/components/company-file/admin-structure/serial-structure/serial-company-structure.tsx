"use client";

import { Button } from "@/components/ui/button";
import ExportButton from "@/modules/table/components/ExportButton";
import { Plus } from "lucide-react";
import React from "react";

const SerialCompanyStructure = () => {
  return (
    <div className="w-full">
      <div className="w-full flex justify-between">
        <h1 className="text-2xl">الهيكل التسلسلي</h1>
        <div className="flex gap-6">
          <Button>
            <Plus />
            إضافة حقل آخر
          </Button>
          <ExportButton data={["omar"]} />
        </div>
      </div>
    </div>
  );
};

export default SerialCompanyStructure;
