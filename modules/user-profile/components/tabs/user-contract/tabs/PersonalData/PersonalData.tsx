import { PersonalDataTabCxtProvider } from "./context/PersonalDataCxt";
import PersonalDataEntryPoint from "./components/enrty-point";

export default function PersonalDataTab({ userId, companyId }: { userId: string, companyId: string }) {
  return (
    <PersonalDataTabCxtProvider userId={userId} companyId={companyId}>
      <PersonalDataEntryPoint />
    </PersonalDataTabCxtProvider>
  );
}
