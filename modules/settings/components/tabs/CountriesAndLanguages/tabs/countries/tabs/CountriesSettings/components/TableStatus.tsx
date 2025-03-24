"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { apiClient } from "@/config/axios-config";
import { Label } from "@/modules/table/components/ui/label";
import { Switch } from "@/modules/table/components/ui/switch";
import { useTableInstance } from "@/modules/table/store/useTableStore";
import { Country } from "@/modules/settings/types/Country";

type PropsT = {
  country: Country;
  url: string;
};

const TableStatus = (props: PropsT) => {
  const { url, country } = props;
  const t = useTranslations();
  const { reloadTable } = useTableInstance("countries-table");

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
        <Label htmlFor={`${country.id}-switcher`} className="font-normal">
          {t("Companies.Active")}
        </Label>
        <Switch
          id={`${country.id}-switcher`}
          checked={country.status == "1"}
          onCheckedChange={handleChange}
        />
      </div>
    </>
  );
};

export default TableStatus;
