import { useCountriesData } from "@/modules/companies/hooks/useCountriesData";
import { useCurrenciesData } from "@/modules/users/hooks/useCurrenciesData";
import { useJobTitles } from "@/modules/users/hooks/useJobTitles";
import { useLanguagesData } from "@/modules/users/hooks/useLanguagesData";
import { useTimeZonesData } from "@/modules/users/hooks/useTimeZonesData";
import { Country } from "@/types/Country";
import { Currency } from "@/types/currency";
import { Language } from "@/types/Language";
import { SelectOption } from "@/types/Option";
import { TimeZone } from "@/types/TimeZone";
import { createContext, useContext } from "react";

// define context type
type CxtType = {
  jobTitles: SelectOption[];
  timeZones: TimeZone[];
  currencies: Currency[];
  languages: Language[];
  countries: Country[];
};

// Create a context
const SetUserLookupsCxt = createContext<CxtType>({
  jobTitles: [],
  timeZones: [],
  currencies: [],
  languages: [],
  countries: [],
});

// Custom hook to use the FormLookupCxt
export const useSetUserLookupsCxt = () => {
  const context = useContext(SetUserLookupsCxt);
  if (!context) {
    throw new Error(
      "useSetUserLookupsCxt must be used within SetUserLookupsCxtProvider"
    );
  }
  return context;
};

type PropsT = React.PropsWithChildren & {
  onModuleClose?: () => void;
};

// Provider to wrap the children components
export default function SetUserLookupsCxtProvider(props: PropsT) {
  const { children } = props;
  // fetch template data
  const { data: jobTitles } = useJobTitles();
  const { data: timeZones } = useTimeZonesData();
  const { data: currencies } = useCurrenciesData();
  const { data: languages } = useLanguagesData();
  const { data: countries } = useCountriesData();

  console.log("languages-languages", languages);

  return (
    <SetUserLookupsCxt.Provider
      value={{
        jobTitles: jobTitles ?? [],
        timeZones: timeZones ?? [],
        currencies: currencies ?? [],
        languages: languages ?? [],
        countries: countries ?? [],
      }}
    >
      {children}
    </SetUserLookupsCxt.Provider>
  );
}
