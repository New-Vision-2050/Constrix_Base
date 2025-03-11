import { Company } from "../../types/Company";
import CompanyFormLookupsCxtProvider from "./context/form-lookups";
import SetCompanyFormContent from "./form-content";

type PropsT = {
  onModuleClose?: (com?: Company) => void;
};

export default function SetCompanyModule({ onModuleClose }: PropsT) {
  return (
    <CompanyFormLookupsCxtProvider onModuleClose={onModuleClose}>
      <SetCompanyFormContent />
    </CompanyFormLookupsCxtProvider>
  );
}
