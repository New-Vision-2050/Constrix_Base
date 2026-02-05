/**
 * Loading spinner component
 * Displays loading state for the table
 */
export const LoadingSpinner = () => {
  return (
    <div className="bg-sidebar rounded-lg p-8">
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground text-sm">
            جاري تحميل المستندات...
          </p>
        </div>
      </div>

      {/* Loading skeleton rows */}
      <div className="mt-6 space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 p-3">
            <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-8 bg-muted animate-pulse rounded"></div>
            <div className="h-4 flex-1 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-12 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-8 bg-muted animate-pulse rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
