'use client';

import React, { createContext, useReducer, ReactNode } from 'react';
import { BreadcrumbItem } from '../types';

// Define state type
interface BreadcrumbsState {
  items: BreadcrumbItem[];
}

// Define action types
type BreadcrumbsAction =
  | { type: 'SET_BREADCRUMBS'; payload: BreadcrumbItem[] }
  | { type: 'ADD_BREADCRUMB'; payload: BreadcrumbItem }
  | { type: 'RESET_BREADCRUMBS' };

// Define context type
export interface BreadcrumbsContextType {
  state: BreadcrumbsState;
  dispatch: React.Dispatch<BreadcrumbsAction>;
}

// Create context with undefined default value
const BreadcrumbsContext = createContext<BreadcrumbsContextType | undefined>(undefined);

// Reducer to handle state updates
function breadcrumbsReducer(state: BreadcrumbsState, action: BreadcrumbsAction): BreadcrumbsState {
  switch (action.type) {
    case 'SET_BREADCRUMBS':
      return { ...state, items: action.payload };

    case 'ADD_BREADCRUMB':
      // Check if breadcrumb already exists
      const existingIndex = state.items.findIndex(item => item.href === action.payload.href);
      
      if (existingIndex >= 0) {
        // If exists, keep only items up to and including this one
        // This effectively removes any breadcrumbs that come after it
        return {
          ...state,
          items: state.items
            .slice(0, existingIndex + 1)
            .map((item, idx) => ({
              ...item,
              isCurrent: idx === existingIndex // Only the clicked one is current
            }))
        };
      }
      
      // If it doesn't exist, add it as a new breadcrumb
      // Mark all other items as not current
      const updatedItems = state.items.map(item => ({
        ...item,
        isCurrent: false,
      }));
      
      // Add new breadcrumb as current
      return {
        ...state,
        items: [...updatedItems, { ...action.payload, isCurrent: true }],
      };

    case 'RESET_BREADCRUMBS':
      return { ...state, items: [] };

    default:
      return state;
  }
}

// Props for provider component
interface BreadcrumbsProviderProps {
  children: ReactNode;
  initialItems?: BreadcrumbItem[];
}

// Provider component
export function BreadcrumbsProvider({
  children,
  initialItems = [],
}: BreadcrumbsProviderProps) {
  const [state, dispatch] = useReducer(breadcrumbsReducer, {
    items: initialItems,
  });

  // Create context value object with only state and dispatch
  const contextValue: BreadcrumbsContextType = {
    state,
    dispatch
  };

  return (
    <BreadcrumbsContext.Provider value={contextValue}>
      {children}
    </BreadcrumbsContext.Provider>
  );
}

// Export context
export { BreadcrumbsContext };
