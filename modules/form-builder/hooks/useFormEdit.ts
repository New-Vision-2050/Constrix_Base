"use client";

import { useState, useEffect, useCallback } from "react";
import { FormConfig } from "../types/formTypes";
import { apiClient } from "@/config/axios-config";

export interface UseFormEditProps {
  config: FormConfig;
  recordId?: string | number | null;
  setValues: (values: Record<string, any>) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  onError?: (error: string) => void;
}

export interface UseFormEditResult {
  isLoading: boolean;
  error: string | null;
  loadData: (id?: string | number) => Promise<void>;
}

/**
 * Hook to handle form editing functionality
 * This can either use passed values directly or fetch data from an API
 */
export const useFormEdit = ({
  config,
  recordId,
  setValues,
  setSubmitting,
  onError,
}: UseFormEditProps): UseFormEditResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to load data for editing
  const loadData = useCallback(
    async (id?: string | number) => {
      // Use provided id or fallback to recordId from props
      const targetId = id || recordId;
      
      // If no ID is provided, we can't load data
      if (!targetId) {
        setError("No record ID provided for editing");
        if (onError) onError("No record ID provided for editing");
        return;
      }

      // If editValues are directly provided in the config, use those
      if (config.editValues) {
        setValues(config.editValues);
        return;
      }

      // If no editApiUrl is provided, we can't load data
      if (!config.editApiUrl) {
        setError("No API URL configured for editing");
        if (onError) onError("No API URL configured for editing");
        return;
      }

      try {
        setIsLoading(true);
        setSubmitting(true);
        setError(null);

        // Replace :id placeholder in URL if present
        const url = config.editApiUrl.replace(":id", String(targetId));
        
        // Make the API request
        const response = await apiClient.get(url, {
          headers: config.editApiHeaders,
        });

        // Extract data from response
        let data = response.data;
        
        // If a data path is specified, extract the data from that path
        if (config.editDataPath) {
          const paths = config.editDataPath.split('.');
          for (const path of paths) {
            data = data[path];
            if (data === undefined) {
              throw new Error(`Data path '${config.editDataPath}' not found in response`);
            }
          }
        }

        // If a data transformer is provided, transform the data
        if (config.editDataTransformer) {
          data = config.editDataTransformer(data);
        }

        // Set the form values
        setValues(data);
      } catch (error: any) {
        console.error("Error loading data for editing:", error);
        const errorMessage = error.response?.data?.message || error.message || "Failed to load data";
        setError(errorMessage);
        if (onError) onError(errorMessage);
      } finally {
        setIsLoading(false);
        setSubmitting(false);
      }
    },
    [config, recordId, setValues, setSubmitting, onError]
  );

  // Load data when recordId changes or when config.editValues changes
  useEffect(() => {
    if (recordId || config.editValues) {
      loadData();
    }
  }, [recordId, config.editValues, loadData]);

  return {
    isLoading,
    error,
    loadData,
  };
};