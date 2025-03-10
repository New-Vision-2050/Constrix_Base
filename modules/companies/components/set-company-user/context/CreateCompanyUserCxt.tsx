import { createContext, useContext, useState } from "react";

// define context type
type CxtType = {
  isCompanyCreated: boolean;
  handleSetCompanyCreated: (created: boolean) => void;
};

// Create a context
const CreateCompanyUserCxt = createContext<CxtType>({
  isCompanyCreated: false,
  handleSetCompanyCreated: () => {},
});

// Custom hook to use the CreateCompanyUserCxt
export const useCreateCompanyUserCxt = () => {
  const context = useContext(CreateCompanyUserCxt);
  if (!context) {
    throw new Error(
      "useCreateCompanyUserCxt must be used within CreateCompanyUserCxtProvider"
    );
  }
  return context;
};

type PropsT = React.PropsWithChildren;

// Provider to wrap the children components
export default function CreateCompanyUserCxtProvider(props: PropsT) {
  const { children } = props;
  const [isCompanyCreated, setCompanyCreated] = useState(false);

  const handleSetCompanyCreated = (created: boolean) =>
    setCompanyCreated(created);

  return (
    <CreateCompanyUserCxt.Provider
      value={{
        isCompanyCreated,
        handleSetCompanyCreated,
      }}
    >
      {children}
    </CreateCompanyUserCxt.Provider>
  );
}
