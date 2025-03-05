"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SetCompanyHeader from "./components/SetCompanyHeader";
import SetCompanyFormContent from "./components/formContent";
import CompanyFormLookupsCxtProvider from "./context/formLookups";

export function SetCompanySheet() {
  return (
    <CompanyFormLookupsCxtProvider>
      <div className="grid grid-cols-2 gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-[200px]">
              Set Company
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SetCompanyHeader />
            <SetCompanyFormContent />
          </SheetContent>
        </Sheet>
      </div>
    </CompanyFormLookupsCxtProvider>
  );
}
