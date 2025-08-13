import { useState, useCallback } from "react";
import { ConstraintDetails } from "../types/constraint";
import { getConstraintDetails } from "../api/getConstraintDetails";

interface UseConstraintDetailsReturn {
  constraintDetails: ConstraintDetails | null;
  loading: boolean;
  error: Error | null;
  fetchConstraintDetails: (id: string) => Promise<void>;
  refetch: () => void;
  setConstraintDetails: (details: ConstraintDetails | null) => void;
}

/**
 * Custom hook for managing constraint details data
 * @returns Object containing constraint details data, loading state, error state, and fetch functions
 */
export const useConstraintDetails = (): UseConstraintDetailsReturn => {
  const [constraintDetails, setConstraintDetails] = useState<ConstraintDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastId, setLastId] = useState<string | null>(null);

  const fetchConstraintDetails = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      setLastId(id);
      const response = await getConstraintDetails(id);
      setConstraintDetails(response.payload);
    } catch (err) {
      setError(err as Error);
      setConstraintDetails(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    if (lastId) {
      fetchConstraintDetails(lastId);
    }
  }, [fetchConstraintDetails, lastId]);

  return {
    constraintDetails,
    loading,
    error,
    fetchConstraintDetails,
    refetch,
    setConstraintDetails,
  };
};
