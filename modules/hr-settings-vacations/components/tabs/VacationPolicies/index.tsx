import { Pagination } from "@/components/shared/Pagination";
import VacationPolicieCardsList from "./VacationPolicieCardsList";
import VacationPoliciesHeader from "./VacationPoliciesHeader";
import BranchiesLst from "./BranchiesLst/BranchiesLst";

/**
 * VacationPoliciesTab component
 * 
 * Responsive layout:
 * - Mobile: Single column layout (full width)
 * - Tablet+: Two columns (1:3 ratio)
 */
export default function VacationPoliciesTab() {
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
        <VacationPolicieCardsList />
        
        {/* Pagination component */}
        <div className="mt-8 flex justify-center w-full">
          <Pagination
            currentPage={1}
            totalPages={1}
            onPageChange={() => {}}
            currentLimit={1}
            limitOptions={[2, 5, 10, 25, 50]}
            onLimitChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
