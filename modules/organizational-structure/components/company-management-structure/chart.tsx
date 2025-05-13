'use client'
import OrganizationChart from '@/modules/organizational-structure/org-chart/components/organization-chart'
import { Loader2 } from 'lucide-react'
import useManagementsTreeData from '@/modules/organizational-structure/hooks/useManagementsTreeData'
import { OrgChartNode } from '@/types/organization'

type PropsT = {
  branchId: string | number;
};

const BranchManagementsStructure = (props: PropsT) => {
  const { branchId } = props;
  const { data: orgData, isLoading, error } = useManagementsTreeData(branchId)

  return (
    <main className="flex-grow md:max-w-[calc(100vw-580px)]">
        {isLoading && (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
            <span className="ltr:ml-2 rtl:mr-2 text-lg text-gray-600">Loading Managements data...</span>
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

export default BranchManagementsStructure
