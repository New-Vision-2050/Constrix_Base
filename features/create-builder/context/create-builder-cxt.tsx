"use client";

// hooks
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

// types
import { CreateBuilderModuleT } from "../types/CreateBuilderModule";

// modules data
import { MODULES_LIST } from "../constants/modules-list";

// define context type
type CxtType = {
  btnLabel: string;
  modules: CreateBuilderModuleT[];
  selectedModule: CreateBuilderModuleT | undefined;
  handleChangeModuleId: (id: string) => void;
  originalModuleId: string | undefined;
  onSheetClose?: () => void;
  handleManuelCloseSheet: () => void;
};

// Create a context
const CreateBuilderCxt = createContext<CxtType>({
  // create button
  btnLabel: "",
  // modules
  modules: MODULES_LIST,
  // selected module
  selectedModule: undefined,
  handleChangeModuleId: () => {},
  // original sended module id
  originalModuleId: undefined,
  // fun to execute on sheet close
  onSheetClose: () => {},
  handleManuelCloseSheet: () => {},
});

// Custom hook to use the FormLookupCxt
export const useCreateBuilderCxt = () => {
  const context = useContext(CreateBuilderCxt);
  if (!context) {
    throw new Error(
      "useCreateBuilderCxt must be used within CreateBuilderCxtProvider"
    );
  }
  return context;
};

type PropsT = React.PropsWithChildren & {
  btnLabel: string;
  moduleId?: string;
  onSheetClose?: () => void;
  handleManuelCloseSheet: () => void;
};

// Provider to wrap the children components
export default function CreateBuilderCxtProvider(props: PropsT) {
  // declare and define state and variables
  const {
    children,
    btnLabel,
    moduleId: originalModuleId,
    onSheetClose,
    handleManuelCloseSheet,
  } = props;
  const [moduleId, setModuleId] = useState(originalModuleId);

  const selectedModule = useMemo(() => {
    return MODULES_LIST?.find((ele) => ele.id === moduleId);
  }, [moduleId]);

  // declare and define helper methods
  const handleChangeModuleId = useCallback((id: string) => {
    setModuleId(id);
  }, []);

  return (
    <CreateBuilderCxt.Provider
      value={{
        // create button
        btnLabel,
        // modules
        modules: MODULES_LIST,
        // selected module
        selectedModule,
        handleChangeModuleId,
        // original sended module id
        originalModuleId,
        // fun to execute on sheet close
        onSheetClose,
        handleManuelCloseSheet,
      }}
    >
      {children}
    </CreateBuilderCxt.Provider>
  );
}
