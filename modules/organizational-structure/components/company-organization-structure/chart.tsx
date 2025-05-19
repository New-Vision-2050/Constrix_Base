'use client'
import OrganizationChart from '@/modules/organizational-structure/org-chart/components/organization-chart'
import { Loader2 } from 'lucide-react'
import useOrgTreeData from '@/modules/organizational-structure/hooks/useOrgTreeData'
import { OrgChartNode } from '@/types/organization'
import { useTranslations } from 'next-intl'

type PropsT = {
  branchId: string | number;
};

const BranchOrganizationStructure = (props: PropsT) => {
  const { branchId } = props;
  const t = useTranslations("CompanyStructure.CompanyOrganizationalStructure");
  const { data: orgData, isLoading, error } = useOrgTreeData(branchId)

  return (
    <main className="flex-grow md:max-w-[calc(100vw-580px)]">
        {isLoading && (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
            <span className="ltr:ml-2 rtl:mr-2 text-lg text-gray-600">{t("loading")}</span>
          </div>
        )}

        {!isLoading && !error && orgData && (
          <div className="overflow-hidden">
            <OrganizationChart data={orgData[0] as OrgChartNode} />
          </div>
        )}
    </main>
  )
}

export default BranchOrganizationStructure
