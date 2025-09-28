import { SearchSelectField } from "@/modules/docs-library/modules/publicDocs/components/search-fields";
import InputDocName from "./InputDocName";
import CheckboxGroup from "./CheckboxGroup";

export default function NotifySettingsView() {
  return (
    <div className="flex flex-col gap-2 w-full p-4">
      {/* email select */}
      <SearchSelectField
        value={""}
        onChange={(value) => console.log(value)}
        options={[{ label: "Email", value: "email" }]}
        placeholder={"Email"}
        disabled={false}
      />
      {/* email input */}
      <InputDocName
        value={""}
        onChange={(str) => console.log(str)}
        disabled={false}
        placeholder={"Email"}
      />
      {/* checkbox group */}
      <CheckboxGroup
        title="Notify Settings"
        options={[
          { id: "email", label: "Email", value: "email" },
          { id: "sms", label: "SMS", value: "sms" },
          { id: "push-notification", label: "Push Notification", value: "push-notification" },
        ]}
        selectedValues={[]}
        onChange={(values) => console.log(values)}
      />
      {/* text area */}
      
    </div>
  );
}
