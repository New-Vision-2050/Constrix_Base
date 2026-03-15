import { useTranslations } from "next-intl";
import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";
import { useFinancialDataCxt } from "../../context/financialDataCxt";
import PrivilegeItem from "./components/privilege-item";
import TabTemplateListLoading from "@/modules/user-profile/components/TabTemplateListLoading";

export default function PrivilegesFormsList() {
  const t = useTranslations("UserProfile.nestedTabs.privilegesAndAllowances");
  const { addedPrivilegesList, addedPrivilegesListLoading } =
    useFinancialDataCxt();

  // handle there is no data found
  if (addedPrivilegesList && addedPrivilegesList.length === 0)
    return (
      <NoDataFounded
        title={t("noData")}
        subTitle={t("noDataSubTitle")}
      />
    );

  // render data
  return (
    <div className="flex flex-col gap-8">
      {addedPrivilegesListLoading ? (
        <TabTemplateListLoading />
      ) : (
        addedPrivilegesList &&
        addedPrivilegesList?.map((item) => (
          <PrivilegeItem privilegeData={item} key={item?.id} />
        ))
      )}
    </div>
  );
}
