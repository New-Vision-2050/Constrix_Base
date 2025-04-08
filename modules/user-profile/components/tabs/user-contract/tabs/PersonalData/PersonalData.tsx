import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import VerticalBtnsList from "../components/vertical-buttons-list";
import { PersonalDataVerticalButtons } from "./constants/VerticalBtns";
import { PersonalDataFormConfig } from "./config/personal-data-form";
import { ConnectionDataFormConfig } from "./config/connection-data-form";

export default function PersonalDataTab() {
  return (
    <div className="flex gap-8">
      <VerticalBtnsList items={PersonalDataVerticalButtons} />
      <div className="p-4 flex-grow gap-8">
        <FormContent config={PersonalDataFormConfig()} />
        <FormContent config={ConnectionDataFormConfig()} />
      </div>
    </div>
  );
}
