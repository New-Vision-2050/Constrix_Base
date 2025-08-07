'use client';

import { useContext, useCallback } from 'react';
import { BreadcrumbsContext } from './BreadcrumbsContext';
import { BreadcrumbItem } from '../types';

/**
 * Custom hook to access and manipulate breadcrumbs state
 */
export function useBreadcrumbs() {
  const context = useContext(BreadcrumbsContext);

  if (!context) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbsProvider');
  }

  const { state, dispatch } = context;

  // Using useCallback to ensure function references remain stable between renders
  const setBreadcrumbs = useCallback((items: BreadcrumbItem[]) => {
    dispatch({ type: 'SET_BREADCRUMBS', payload: items });
  }, [dispatch]);

  const addBreadcrumb = useCallback((item: BreadcrumbItem) => {
    dispatch({ type: 'ADD_BREADCRUMB', payload: item });
  }, [dispatch]);

  const resetBreadcrumbs = useCallback(() => {
    dispatch({ type: 'RESET_BREADCRUMBS' });
  }, [dispatch]);

  return {
    breadcrumbs: state.items,
    setBreadcrumbs,
    addBreadcrumb,
    resetBreadcrumbs
  };
}
