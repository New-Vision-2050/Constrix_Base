import { useJobTitles } from "@/modules/users/hooks/useJobTitles";
import { SelectOption } from "@/types/Option";
import { createContext, useContext } from "react";

// define context type
type CxtType = {
  jobTitles: SelectOption[];
};

// Create a context
const SetUserLookupsCxt = createContext<CxtType>({
  jobTitles: [],
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

  return (
    <SetUserLookupsCxt.Provider value={{ jobTitles: jobTitles ?? [] }}>
      {children}
    </SetUserLookupsCxt.Provider>
  );
}
