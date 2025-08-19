import { Pagination } from "@/components/shared/Pagination";
import VacationPolicieCardsList from "./VacationPolicieCardsList";
import VacationPoliciesHeader from "./VacationPoliciesHeader";
import BranchiesLst from "./BranchiesLst/BranchiesLst";
import { useHRVacationCxt } from "@/modules/hr-settings-vacations/context/hr-vacation-cxt";
import LoadingState from "../../shared/LoadingState";
import NoDataFound from "../../shared/NoDataFound";
import { useTranslations } from "next-intl";

/**
 * VacationPoliciesTab component
 *
 * Responsive layout:
 * - Mobile: Single column layout (full width)
 * - Tablet+: Two columns (1:3 ratio)
 */
export default function VacationPoliciesTab() {
  const {
    vacationsPoliciesLoading,
    handleVPPageChange,
    handleVPLimitChange,
    VPPage,
    VPLimit,
    VPLastPage,
    vacationsPolicies,
  } = useHRVacationCxt();
  const t = useTranslations("HRSettingsVacations.leavesPolicies");

  return (
    // Grid with 4 columns on tablet+ screens, 1 column on mobile
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* First column takes 1 column (1/4 width) on tablet+ and full width on mobile */}
      <div className="col-span-1 bg-[#140F35] rounded-lg p-4">
        <BranchiesLst />
      </div>

      {/* Second column takes 3 columns (3/4 width) on tablet+ and full width on mobile */}
      <div className="col-span-1 md:col-span-3">
        <VacationPoliciesHeader />

        {/* loading state */}
        {vacationsPoliciesLoading && (
          <LoadingState
            title={t("loading.title")}
            description={t("loading.description")}
          />
        )}
        {/* no data state */}
        {!vacationsPoliciesLoading && vacationsPolicies.length === 0 && (
          <NoDataFound
            title={t("noData.title")}
            description={t("noData.description")}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1.5" />
                <path d="M16 2v4" />
                <path d="M8 2v4" />
                <path d="M3 10h18" />
                <path d="M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6v0Z" />
              </svg>
            }
          />
        )}
        {/* data state */}
        {vacationsPolicies.length > 0 && !vacationsPoliciesLoading && (
          <>
            <VacationPolicieCardsList />
            {/* Pagination component */}
            <div className="mt-8 flex justify-center w-full">
              <Pagination
                currentPage={VPPage}
                totalPages={VPLastPage}
                onPageChange={handleVPPageChange}
                currentLimit={VPLimit}
                limitOptions={[2, 5, 10, 25, 50]}
                onLimitChange={handleVPLimitChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
