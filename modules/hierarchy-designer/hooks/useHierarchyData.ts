"use client";

import { useState, useEffect, useCallback } from 'react';
import { HierarchyNode, HierarchyDataSource } from '../types/hierarchyTypes';
import useHierarchyStore from '../store/useHierarchyStore';

/**
 * Hook for fetching and managing hierarchy data
 * 
 * @param source The data source configuration (URL or JSON)
 * @returns Object containing loading state, error state, and data
 */
const useHierarchyData = (source: HierarchyDataSource) => {
  const { 
    setData, 
    setLoading, 
    setError, 
    data,
    isLoading,
    error
  } = useHierarchyStore();

  /**
   * Fetch data from a URL
   */
  const fetchFromUrl = useCallback(async (url: string, headers?: Record<string, string>) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        headers: headers || {},
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }

      const jsonData = await response.json();
      setData(jsonData);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setLoading(false);
    }
  }, [setData, setLoading, setError]);

  /**
   * Load data from a JSON object
   */
  const loadFromJson = useCallback((jsonData: HierarchyNode) => {
    setLoading(true);
    setError(null);
    
    try {
      setData(jsonData);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON data');
      setLoading(false);
    }
  }, [setData, setLoading, setError]);

  /**
   * Reload data from the current source
   */
  const reloadData = useCallback(() => {
    if (source.type === 'url') {
      fetchFromUrl(source.url, source.headers);
    } else if (source.type === 'json') {
      loadFromJson(source.data);
    }
  }, [source, fetchFromUrl, loadFromJson]);

  // Load data when the source changes
  useEffect(() => {
    if (source.type === 'url') {
      fetchFromUrl(source.url, source.headers);
    } else if (source.type === 'json') {
      loadFromJson(source.data);
    }
  }, [source, fetchFromUrl, loadFromJson]);

  return {
    data,
    isLoading,
    error,
    reloadData,
  };
};

export default useHierarchyData;