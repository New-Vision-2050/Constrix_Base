import { useCompanyFields } from "@/modules/companies/hooks/useCompanyFields";
import { useCompanyUsers } from "@/modules/companies/hooks/useCompanyUsers";
import { useCountriesData } from "@/modules/companies/hooks/useCountriesData";
import { User } from "@/modules/users/types/User";
import { CompanyField } from "@/modules/companies/types/CompanyField";
import { Country } from "@/types/Country";
import { createContext, useContext } from "react";

// define context type
type CxtType = {
  countries: Country[];
  fields: CompanyField[];
  users: User[];
};

// Create a context
const CompanyFormLookupsCxt = createContext<CxtType>({
  countries: [],
  fields: [],
  users: [],
});

// Custom hook to use the FormLookupCxt
export const useCompanyFormLookupsCxt = () => {
  const context = useContext(CompanyFormLookupsCxt);
  if (!context) {
    throw new Error(
      "useCompanyFormLookupsCxt must be used within CompanyFormLookupsCxtProvider"
    );
  }
  return context;
};

type PropsT = React.PropsWithChildren;

// Provider to wrap the children components
export default function CompanyFormLookupsCxtProvider(props: PropsT) {
  const { children } = props;
  // fetch template data
  const { data: countries } = useCountriesData();
  const { data: fields } = useCompanyFields();
  const { data: users } = useCompanyUsers();

  return (
    <CompanyFormLookupsCxt.Provider
      value={{
        countries: countries ?? [],
        fields: fields ?? [],
        users: users ?? [],
      }}
    >
      {children}
    </CompanyFormLookupsCxt.Provider>
  );
}
