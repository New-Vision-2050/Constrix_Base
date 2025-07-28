"use client";
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Accordion } from "@/components/ui/accordion";
import { MainAccordionPermissions } from "./types";
import SubAccordionCategory from "./SubAccordionCategory";

interface MainAccordionCategoryProps {
  mainKey: string;
  mainData: MainAccordionPermissions;
  selectedPermissions: Set<string>;
  switchStates: Record<string, boolean>;
  activeStates: Record<string, boolean>;
  numberValues: Record<string, number>;
  onPermissionChange: (permissionId: string, checked: boolean) => void;
  onSwitchChange: (switchId: string, checked: boolean) => void;
  onNumberChange: (subKey: string, value: number) => void;
}

function MainAccordionCategory({
  mainKey,
  mainData,
  selectedPermissions,
  switchStates,
  activeStates,
  numberValues,
  onPermissionChange,
  onSwitchChange,
  onNumberChange,
}: MainAccordionCategoryProps) {
  return (
    <AccordionItem value={mainKey} className="border rounded-lg">
      <AccordionTrigger className="px-4 py-3 text-lg font-semibold rounded-t-lg">
        {mainKey}
      </AccordionTrigger>
      <AccordionContent className="px-4 py-3">
        <Accordion type="multiple" className="w-full space-y-2">
          {Object.entries(mainData).map(([subKey, subData]) => {
            if (!subData || Object.keys(subData).length === 0) {
              return null;
            }

            return (
              <SubAccordionCategory
                key={`${mainKey}-${subKey}`}
                mainKey={mainKey}
                subKey={subKey}
                subData={subData}
                selectedPermissions={selectedPermissions}
                switchStates={switchStates}
                activeStates={activeStates}
                numberValues={numberValues}
                onPermissionChange={onPermissionChange}
                onSwitchChange={onSwitchChange}
                onNumberChange={onNumberChange}
              />
            );
          })}
        </Accordion>
      </AccordionContent>
    </AccordionItem>
  );
}

export default MainAccordionCategory;
