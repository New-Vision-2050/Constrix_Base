"use client";
import { apiClient } from "@/config/axios-config";
import { Label } from "@/modules/table/components/ui/label";
import { Switch } from "@/modules/table/components/ui/switch";
import { useToast } from "@/modules/table/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";

const SubTableStatus = ({
  id,
  theStatus,
}: {
  id: string;
  theStatus: 0 | 1;
}) => {
  const { toast } = useToast();

  const { mutate } = useMutation({
    mutationFn: async (is_active: boolean) => {
      return await apiClient.put(`sub_entities/${id}/status`, {
        is_active: Number(is_active),
      });
    },
  });

  // toast({
  //   title: "Error",
  //   description: error,
  //   variant: "destructive",
  // })

  const [isActive, setIsActive] = useState(!!theStatus);

  const handleSwitch = () => {
    const pastState = isActive;
    setIsActive((prev) => !prev);
    mutate(!pastState, {
      onError: () => {
        setIsActive(pastState);
        toast({
          title: "Error",
          description: "فشل تغيير حالة الجدول",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={`${id}-switcher`} className="font-normal">
        نشط{" "}
      </Label>
      <Switch
        id={`${id}-switcher`}
        checked={isActive}
        onCheckedChange={handleSwitch}
      />
    </div>
  );
};

export default SubTableStatus;
