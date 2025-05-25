'use client'
import OrganizationChart from '@/modules/organizational-structure/org-chart/components/organization-chart'
import { Loader2 } from 'lucide-react'
import useEmployeesTreeData from '@/modules/organizational-structure/hooks/useEmployeesTreeData'
import { OrgChartNode } from '@/types/organization'
import { useTranslations } from 'next-intl'

type PropsT = {
  branchId: string | number;
};

const BranchEmployeesOrganizationStructure = (props: PropsT) => {
  const { branchId } = props;
  const t = useTranslations("CompanyStructure.CompanyOrganizationalStructure");
  const { data: employeesData, isLoading, error } = useEmployeesTreeData(branchId)

  return (
    <main className="flex-grow md:max-w-[calc(100vw-580px)]">
        {isLoading && (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
            <span className="ltr:ml-2 rtl:mr-2 text-lg text-gray-600">{t("loading")}</span>
          </div>
        )}

        {!isLoading && !error && employeesData && (
          <div className="overflow-hidden">
            {/*<OrganizationChart data={orgData[0] as OrgChartNode} reOrganize={{concatKey: 'type', concatValue: 'branch'}} />*/}
            <OrganizationChart data={employeesData[0] as OrgChartNode} isEmployees reOrganize={{concatKey: 'type', concatValue: 'employee'}} />
          </div>
        )}
    </main>
  )
}

export default BranchEmployeesOrganizationStructure
