import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import FormFieldSet from "../../../components/FormFieldSet";
import { ConnectionDataFormConfig } from "./config/connection-data-form";
import { IdentityDataFormConfig } from "./config/Identity-data-form";
import { PassportDataFormConfig } from "./config/Passport-form-config";
import PersonalDataSectionPersonalForm from "./components/personal-user-data";

export default function PersonalDataSection() {
  return (
    <>
      <PersonalDataSectionPersonalForm />

      <FormFieldSet title="بيانات الاتصال">
        <FormContent config={ConnectionDataFormConfig()} />
      </FormFieldSet>

      <FormFieldSet title="بيانات الهوية">
        <FormContent config={IdentityDataFormConfig()} />
      </FormFieldSet>

      <FormFieldSet title="بيانات جواز السفر">
        <FormContent config={PassportDataFormConfig()} />
      </FormFieldSet>
    </>
  );
}
