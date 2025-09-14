"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useCRMSettingDataCxt } from "../../context/CRMSettingData";
import { apiClient, baseURL } from "@/config/axios-config";
import { toast } from "sonner";
import { useState } from "react";

// import Checkbox from "@/components/shared/Checkbox";

export default function ClientsSettings() {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("CRMSettingsModule.ClientsSettings");
  const { sharedSettings, sharedSettingsLoading, refetchSharedSettings } =
    useCRMSettingDataCxt();

  // loading state
  if (sharedSettingsLoading) {
    return <div>Loading...</div>;
  }

  // handle change
  const handleChange = async (sharedClient: Boolean, sharedBroker: Boolean) => {
    try {
      setLoading(true);
      await apiClient.put(`${baseURL}/settings`, {
        settings: [
          { key: "is_share_client", value: sharedClient ? "1" : "0" },
          { key: "is_share_broker", value: sharedBroker ? "1" : "0" },
        ],
      });

      refetchSharedSettings();
      toast.success("Settings updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Checkbox
          defaultChecked={sharedSettings?.is_share_client === "1"}
          disabled={loading}
          onCheckedChange={(checked) => {
            handleChange(
              Boolean(checked),
              sharedSettings?.is_share_broker === "1"
            );
          }}
        />
        <Label>{t("shareClientsData")}</Label>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          defaultChecked={sharedSettings?.is_share_broker === "1"}
          disabled={loading}
          onCheckedChange={(checked) => {
            handleChange(
              sharedSettings?.is_share_client === "1",
              Boolean(checked)
            );
          }}
        />
        <Label>{t("shareBrokersData")}</Label>
      </div>
    </div>
  );
}
