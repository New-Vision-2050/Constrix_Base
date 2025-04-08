import VerticalBtnsList from "../components/vertical-buttons-list";
import BankingDataSection from "./components/BankingDataSection";
// import PersonalDataSection from "./components/PersonalDataSection";
import { PersonalDataVerticalButtons } from "./constants/VerticalBtns";

export default function PersonalDataTab() {
  return (
    <div className="flex gap-8">
      <VerticalBtnsList items={PersonalDataVerticalButtons} />
      <div className="p-4 flex-grow gap-8">
        {/* <PersonalDataSection /> */}
        <BankingDataSection />
      </div>
    </div>
  );
}
