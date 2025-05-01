import { Skeleton } from "@/components/ui/skeleton";

export function TabTemplateLoading() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="col-span-1">
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}
