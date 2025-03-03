"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import SetCompanyHeader from "./SetCompanyHeader";
import SetCompanyFormContent from "./formContent";

export function SetCompanySheet() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Set Company</Button>
        </SheetTrigger>
        <SheetContent side={"left"}>
          <SetCompanyHeader />
          <SetCompanyFormContent />
        </SheetContent>
      </Sheet>
    </div>
  );
}
