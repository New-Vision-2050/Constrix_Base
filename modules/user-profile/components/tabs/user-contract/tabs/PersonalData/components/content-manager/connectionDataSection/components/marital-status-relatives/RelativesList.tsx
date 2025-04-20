import RegularList from "@/components/shared/RegularList";
import { useConnectionDataCxt } from "../../context/ConnectionDataCxt";
import RelativeData from "./relative";
import { Relative } from "@/modules/user-profile/types/relative";

export default function RelativesList() {
  const { userRelativesData } = useConnectionDataCxt();

  return (
    <RegularList<Relative, "relative">
      sourceName="relative"
      items={userRelativesData ?? []}
      ItemComponent={RelativeData}
    />
  );
}
