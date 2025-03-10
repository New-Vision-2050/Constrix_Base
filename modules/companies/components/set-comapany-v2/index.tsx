import CompanyFormLookupsCxtProvider from "./context/form-lookups";
import SetCompanyFormContent from "./form-content";

export default function SetCompanyModule() {
  return (
    <CompanyFormLookupsCxtProvider>
      <SetCompanyFormContent />
    </CompanyFormLookupsCxtProvider>
  );
}
