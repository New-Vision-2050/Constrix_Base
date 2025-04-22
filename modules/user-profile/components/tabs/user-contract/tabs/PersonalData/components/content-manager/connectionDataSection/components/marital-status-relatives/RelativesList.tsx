import RegularList from "@/components/shared/RegularList";
import { useConnectionDataCxt } from "../../context/ConnectionDataCxt";
import RelativeData from "./relative";
import { Relative } from "@/modules/user-profile/types/relative";
import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";

export default function RelativesList() {
  const { userRelativesData } = useConnectionDataCxt();

  // handle there is no data found
  if (userRelativesData && userRelativesData.length === 0)
    return (
      <NoDataFounded
        title="لا يوجد بيانات"
        subTitle="لا يوجد بيانات تخص الأقارب للمستخدم قم باضافة قريب"
      />
    );

  // render data
  return (
    <RegularList<Relative, "relative">
      sourceName="relative"
      items={userRelativesData ?? []}
      ItemComponent={RelativeData}
    />
  );
}
