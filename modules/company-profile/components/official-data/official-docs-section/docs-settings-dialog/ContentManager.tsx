import SettingsTypesBtns from "./SettingsTypesBtns";
import AddDocView from "./AddDocumentType/AddDocView";
import NotifySettingsView from "./NotifySettingsView";
import ShareSettingsView from "./ShareSettingsView";
import { SettingsBtnsTypes, useDocsSettingsCxt } from "./context/DocsSettingsCxt";

export default function DocsSettingsContentManager() {
  const { settingsBtnType } = useDocsSettingsCxt();

  const CorrectView = () => {
    switch (settingsBtnType) {
      case SettingsBtnsTypes.AddDoc:
        return <AddDocView />;
      case SettingsBtnsTypes.NotifySettings:
        return <NotifySettingsView />;
      case SettingsBtnsTypes.ShareSettings:
        return <ShareSettingsView />;
      default:
        return <AddDocView />;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <SettingsTypesBtns />
      {CorrectView()}
    </div>
  );
}
