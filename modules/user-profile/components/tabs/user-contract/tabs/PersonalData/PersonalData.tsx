import VerticalBtnsList from "../components/vertical-buttons-list";
import { PersonalDataVerticalButtons } from "./constants/VerticalBtns";

export default function PersonalDataTab() {
  return (
    <div className="flex gap-8">
      <VerticalBtnsList items={PersonalDataVerticalButtons} />
      <span>personal data</span>
    </div>
  );
}
