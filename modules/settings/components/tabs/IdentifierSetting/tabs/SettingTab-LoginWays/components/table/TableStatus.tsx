"use client";
import React from "react";
import { Label } from "@/modules/table/components/ui/label";
import { Switch } from "@/modules/table/components/ui/switch";
import { useTranslations } from "next-intl";
import { apiClient } from "@/config/axios-config";
import { LoginWay } from "@/modules/settings/types/LoginWay";
import { useTableInstance } from "@/modules/table/store/useTableStore";

type PropsT = {
  loginWay: LoginWay;
  url: string;
};

const TableStatus = (props: PropsT) => {
  const { url, loginWay } = props;
  const t = useTranslations();
  const { reloadTable } = useTableInstance("login-ways-table");

  const handleChange = async () => {
    try {
      await apiClient.post(`${url}`);
      reloadTable();
    } catch (err) {
      console.log("err_err_err_err", err);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Label htmlFor={`${loginWay.id}-switcher`} className="font-normal">
          {t("Companies.Active")}
        </Label>
        <Switch
          id={`${loginWay.id}-switcher`}
          checked={loginWay.default == 1}
          onCheckedChange={handleChange}
        />
      </div>
    </>
  );
};

export default TableStatus;
