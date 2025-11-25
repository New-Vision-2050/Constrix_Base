import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

/**
 * Custom hook for rendering data loading and error states
 * 
 * Follows Single Responsibility Principle - only handles state rendering logic
 * Returns null if data is ready, or a JSX element for loading/error states
 * 
 * @param isLoading - Whether data is loading
 * @param error - Error object if data fetch failed
 * @param refetch - Function to retry data fetching
 * @param errorMessage - Custom error message
 * @returns JSX element for loading/error state, or null if data is ready
 */
interface UseDataStatesProps {
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  errorMessage?: string;
}

export const useDataStates = ({
  isLoading,
  error,
  refetch,
  errorMessage,
}: UseDataStatesProps): JSX.Element | null => {
  if (error) {
    return <ErrorState message={errorMessage} onRetry={refetch} />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  return null;
};

