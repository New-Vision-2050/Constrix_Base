import { useCountriesData } from "@/modules/companies/hooks/useCountriesData";
import { createContext, useContext, useMemo } from "react";

// define context type
type CxtType = {};

// Create a context
const CompanyFormLookupsCxt = createContext<CxtType>({});

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
  // const { data, isLoading, isError } = useCountriesData();
  // console.log('data',data)

  return (
    <CompanyFormLookupsCxt.Provider value={{}}>
      {children}
    </CompanyFormLookupsCxt.Provider>
  );
}
