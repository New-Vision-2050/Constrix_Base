import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";
import { useFinancialDataCxt } from "../../context/financialDataCxt";
import PrivilegeItem from "./components/privilege-item";

export default function PrivilegesFormsList() {
  const { addedPrivilegesList } = useFinancialDataCxt();

  // handle there is no data found
  if (addedPrivilegesList && addedPrivilegesList.length === 0)
    return (
      <NoDataFounded
        title="لا يوجد بيانات"
        subTitle="لا يوجد بدلات للمستخدم قم باضافة بدل جديد"
      />
    );

  // render data
  return (
    <div className="flex flex-col gap-8">
      {addedPrivilegesList &&
        addedPrivilegesList?.map((item) => (
          <PrivilegeItem privilegeData={item} key={item?.id} />
        ))}
    </div>
  );
}
