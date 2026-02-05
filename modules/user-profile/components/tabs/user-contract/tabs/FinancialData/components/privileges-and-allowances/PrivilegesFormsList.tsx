import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";
import {useFinancialDataCxt} from "../../context/financialDataCxt";
import PrivilegeItem from "./components/privilege-item";
import TabTemplateListLoading from "@/modules/user-profile/components/TabTemplateListLoading";
import {useTranslations} from "next-intl";

export default function PrivilegesFormsList() {
    const t = useTranslations("UserProfile");
    const {addedPrivilegesList, addedPrivilegesListLoading} =
        useFinancialDataCxt();

    // handle there is no data found
    if (addedPrivilegesList && addedPrivilegesList.length === 0)
        return (
            <NoDataFounded
                title={t("tabs.financialData.noData")}
                subTitle={t("tabs.financialData.noDataSubTitle")}
            />
        );

    // render data
    return (
        <div className="flex flex-col gap-8">
            {addedPrivilegesListLoading ? (
                <TabTemplateListLoading/>
            ) : (
                addedPrivilegesList &&
                addedPrivilegesList?.map((item) => (
                    <PrivilegeItem privilegeData={item} key={item?.id}/>
                ))
            )}
        </div>
    );
}
