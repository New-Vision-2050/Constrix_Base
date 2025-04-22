import RegularList from "@/components/shared/RegularList";
import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";
import { Qualification } from "@/modules/user-profile/types/qualification";
import SingleQualificationData from "./SingleQualificationData";

type PropsT = {
  items: Qualification[] | undefined;
};

export default function QualificationsList({ items }: PropsT) {
  // handle there is no data found
  if (items && items.length === 0)
    return (
      <NoDataFounded
        title="لا يوجد بيانات"
        subTitle="لا يوجد بيانات تخص الأقارب للمستخدم قم باضافة قريب"
      />
    );

  // render data
  return (
    <RegularList<Qualification, "qualification">
      sourceName="qualification"
      ItemComponent={SingleQualificationData}
      items={items ?? []}
    />
  );
}
