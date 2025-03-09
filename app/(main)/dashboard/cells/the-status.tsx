import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React, { useState } from "react";

const TheStatus = ({
  theStatus,
  id,
}: {
  theStatus: "active" | "inActive";
  id: string;
}) => {
  const [isActive, setIsActive] = useState(!!theStatus);
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={`${id}-switcher`} className="font-normal">
        نشط
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
