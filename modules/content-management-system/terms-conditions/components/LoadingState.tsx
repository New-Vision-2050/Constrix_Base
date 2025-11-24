import { Loader2 } from "lucide-react";

/**
 * Loading State Component
 * 
 * Displays a centered loading spinner
 * Follows Single Responsibility Principle - only handles loading UI
 */
export default function LoadingState() {
  return (
    <div className="px-6 py-4 flex justify-center items-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
    </div>
  );
}

