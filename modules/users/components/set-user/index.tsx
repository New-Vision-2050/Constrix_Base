import SetUserLookupsCxtProvider from "./context/SetUserLookups";
import UserFormContent from "./form-content";

type PropsT = {
  companyId?: string;
};
export default function SetUserModule({ companyId }: PropsT) {
  return (
    <SetUserLookupsCxtProvider>
      <UserFormContent companyId={companyId} />
    </SetUserLookupsCxtProvider>
  );
}
