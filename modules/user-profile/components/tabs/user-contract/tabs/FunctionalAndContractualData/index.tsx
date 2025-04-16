import FunctionalAndContractualDataEntryPoint from "./components/entry-point";
import { FunctionalContractualCxtProvider } from "./context";

export default function FunctionalAndContractualData() {
  return (
    <FunctionalContractualCxtProvider>
      <FunctionalAndContractualDataEntryPoint />
    </FunctionalContractualCxtProvider>
  );
}
