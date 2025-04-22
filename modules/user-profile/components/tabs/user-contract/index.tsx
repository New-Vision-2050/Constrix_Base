import { useTranslations } from "next-intl";
import { GetUserContractTabsList } from "./constants/UserContractTabs";
import HorizontalTabs from "@/components/shared/HorizontalTabs";

export default function UserContractTab() {
  // declare and define component state and variables.
  const t = useTranslations("UserProfile.tabs.contractTabs");
  // declare and define component helper methods.
  // return component ui.
  return <HorizontalTabs list={GetUserContractTabsList(t)} />;
}
