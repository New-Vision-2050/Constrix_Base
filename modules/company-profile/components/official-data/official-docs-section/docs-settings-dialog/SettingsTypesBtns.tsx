import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { SettingsBtnsTypes, useDocsSettingsCxt } from "./DocsSettingsCxt";

export default function SettingsTypesBtns() {
  const { settingsBtnType, handleChangeSettingsBtnType } = useDocsSettingsCxt();
  const t = useTranslations("companyProfile.officialDocs.docsSettingsDialog");

  return (
    <div className="flex items-center justify-around my-2">
      <Button
        variant={
          settingsBtnType === SettingsBtnsTypes.AddDoc ? "default" : "outline"
        }
        onClick={() => handleChangeSettingsBtnType(SettingsBtnsTypes.AddDoc)}
      >
        {t("addDoc")}
      </Button>
      <Button
        variant={
          settingsBtnType === SettingsBtnsTypes.NotifySettings
            ? "default"
            : "outline"
        }
        onClick={() =>
          handleChangeSettingsBtnType(SettingsBtnsTypes.NotifySettings)
        }
      >
        {t("notifySettings")}
      </Button>
      <Button
        variant={
          settingsBtnType === SettingsBtnsTypes.ShareSettings
            ? "default"
            : "outline"
        }
        onClick={() =>
          handleChangeSettingsBtnType(SettingsBtnsTypes.ShareSettings)
        }
      >
        {t("shareSettings")}
      </Button>
    </div>
  );
}
