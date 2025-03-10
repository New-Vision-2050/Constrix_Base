import CreateCompanyUserCxtProvider from "./context/CreateCompanyUserCxt";
import CreateCompanyUserModuleEntryPoint from "./components/entry-point";

export default function CreateCompanyUserModule() {
  return (
    <CreateCompanyUserCxtProvider>
      <CreateCompanyUserModuleEntryPoint />
    </CreateCompanyUserCxtProvider>
  );
}
