import { PersonalDataTabCxtProvider } from "./context/PersonalDataCxt";
import PersonalDataEntryPoint from "./components/enrty-point";

export default function PersonalDataTab() {
  return (
    <PersonalDataTabCxtProvider>
      <PersonalDataEntryPoint />
    </PersonalDataTabCxtProvider>
  );
}
