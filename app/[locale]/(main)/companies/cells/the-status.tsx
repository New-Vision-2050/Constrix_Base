"use client";
import { Label } from "@/modules/table/components/ui/label";
import { Switch } from "@/modules/table/components/ui/switch";
import React, { useState } from "react";
import { useTranslations } from "next-intl";

const TheStatus = ({
  theStatus,
  id,
}: {
  theStatus: "active" | "inActive";
  id: string;
}) => {
  const t = useTranslations();
  const [isActive, setIsActive] = useState(!!theStatus);

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={`${id}-switcher`} className="font-normal">
        {t("Companies.Active")}
      </Label>
      <Switch
        id={`${id}-switcher`}
        checked={isActive}
        onCheckedChange={(s) => setIsActive(s)}
      />
    </div>
  );
};

export default TheStatus;
