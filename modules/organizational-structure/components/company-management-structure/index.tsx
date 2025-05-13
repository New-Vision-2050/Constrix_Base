"use client";
import { CircleCheck, Loader2, MapPin } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCurrentCompany } from '@/modules/company-profile/components/shared/company-header'
import { useLocale } from 'next-intl'
import BranchManagementsStructure
  from '@/modules/organizational-structure/components/company-management-structure/chart'

const CompanyManagementsStructure = () => {

  const locale = useLocale();
  const { data: companyData, isLoading: isCompanyLoading } = useCurrentCompany();

  return (
    <div>
      {isCompanyLoading && (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg text-gray-600">Loading Company Branches...</span>
        </div>
      )}
      {!isCompanyLoading && companyData && (
      <Tabs
        defaultValue={companyData?.payload?.branches[0]?.id ?? undefined}
        className="w-full flex flex-col md:flex-row"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <TabsList
          className="flex flex-col bg-sidebar p-2 w-36 h-full gap-4 rounded-lg justify-start"
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          {companyData?.payload?.branches?.map((tab) => (
            <TabsTrigger
              key={tab.id}
              className="flex items-start justify-between w-full px-2 py-4 rounded-md data-[state=active]:bg-sidebar gap-2 whitespace-normal"
              value={tab.id}
              title={tab.name}
            >
              <div className="flex text-sm items-start text-start gap-2 grow">
                <MapPin size={18} className="shrink-0" />
                <p className="w-[60px] truncate whitespace-normal">
                  {tab.name}
                </p>
              </div>
              <CircleCheck
                size={18}
                className="text-green-500 shrink-0 me-auto"
              />
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex-1">
          {companyData?.payload?.branches?.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              dir={locale === "ar" ? "rtl" : "ltr"}
              className="h-full ltr:pl-6 rtl:pr-6"
            >
              <BranchManagementsStructure branchId={tab.id}/>
            </TabsContent>
          ))}
        </div>
      </Tabs>)
      }
    </div>
  );
};

export default CompanyManagementsStructure;
