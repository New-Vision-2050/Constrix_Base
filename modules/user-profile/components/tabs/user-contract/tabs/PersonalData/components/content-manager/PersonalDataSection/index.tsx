import PersonalDataSectionPersonalForm from "./components/personal-user-data";
import ConnectionDataSectionPersonalForm from "./components/connection-user-data";
import IdentityDataSectionPersonalForm from "./components/Identity-user-data";
import PassportDataSectionPersonalForm from "./components/passport-user-data";

export default function PersonalDataSection() {
  return (
    <div className="flex flex-col gap-6">
      <PersonalDataSectionPersonalForm />

      <ConnectionDataSectionPersonalForm />

      <IdentityDataSectionPersonalForm />

      <PassportDataSectionPersonalForm />
    </div>
  );
}
