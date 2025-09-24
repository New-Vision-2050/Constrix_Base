import { Pagination } from "@/components/shared/Pagination";
import GridItem from "./GridItem";

export default function GridViewMode() {
  return (
    <div className="min-h-96 bg-sidebar rounded-lg p-4 flex flex-col justify-between">
      {/* items */}
      <div className="flex flex-row items-center gap-6 flex-wrap flex-grow">
        {Array.from({ length: 9 }).map((_, index) => (
          <GridItem key={index} />
        ))}
      </div>
      {/* Pagination component */}
      <div className="mt-8 flex justify-center w-full">
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={() => {}}
          currentLimit={1}
          limitOptions={[2, 5, 10, 25, 50]}
          onLimitChange={() => {}}
        />
      </div>
    </div>
  );
}
