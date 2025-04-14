import { UserContractTabsList } from "./constants/UserContractTabs";
import HorizontalTabs from "@/components/shared/HorizontalTabs";

export default function UserContractTab() {
  // declare and define component state and variables.
  // declare and define component helper methods.
  // return component ui.
  return <HorizontalTabs list={UserContractTabsList} />;
}
