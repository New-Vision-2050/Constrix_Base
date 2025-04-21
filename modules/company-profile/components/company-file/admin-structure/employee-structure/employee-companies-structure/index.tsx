import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";

const EmployeeCompaniesStructure = () => {
  return (
    <div className="w-full">
      <div className="w-full flex justify-between">
        <h1 className="text-2xl">نوع الوظيفة</h1>
        <div className="flex gap-6">
          <Button>
            <Plus />
            إضافة حقل آخر
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCompaniesStructure;
