"use client";

import React, { useState } from 'react';
import { HierarchyViewMode } from '../../types/hierarchyTypes';
import useHierarchyExport from '../../hooks/useHierarchyExport';
import useHierarchyStore from '../../store/useHierarchyStore';

interface ControlPanelProps {
  currentView: HierarchyViewMode;
  onViewChange: (view: HierarchyViewMode) => void;
  onExport?: (format: 'pdf' | 'json', data: any) => void;
  onReload?: () => void;
  className?: string;
}

/**
 * Control panel component for the hierarchy designer
 * 
 * @param props Component props
 * @returns React component
 */
const ControlPanel: React.FC<ControlPanelProps> = ({
  currentView,
  onViewChange,
  onExport,
  onReload,
  className = '',
}) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const { exportToPdf, exportToJson } = useHierarchyExport();
  const { searchTerm, setSearchTerm } = useHierarchyStore();

  // Handle export button click
  const handleExport = async (format: 'pdf' | 'json') => {
    setIsExportMenuOpen(false);
    
    let exportData;
    
    if (format === 'pdf') {
      exportData = await exportToPdf();
    } else {
      exportData = exportToJson();
    }
    
    if (onExport && exportData) {
      onExport(format, exportData);
    }
  };

  return (
    <div 
      className={`hierarchy-control-panel ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
        gap: '0.75rem',
      }}
    >
      {/* View Toggle */}
      <div className="view-toggle" style={{ display: 'flex', borderRadius: '0.375rem', overflow: 'hidden' }}>
        <button
          onClick={() => onViewChange('tree')}
          style={{
            padding: '0.5rem 0.75rem',
            backgroundColor: currentView === 'tree' ? '#3b82f6' : '#e5e7eb',
            color: currentView === 'tree' ? '#fff' : '#4b5563',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v18M5 7h14M3 11h18M5 15h14M8 19h8"></path>
          </svg>
          Tree
        </button>
        <button
          onClick={() => onViewChange('list')}
          style={{
            padding: '0.5rem 0.75rem',
            backgroundColor: currentView === 'list' ? '#3b82f6' : '#e5e7eb',
            color: currentView === 'list' ? '#fff' : '#4b5563',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
          List
        </button>
      </div>

      {/* Search Box */}
      <div className="search-box" style={{ flex: 1 }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search nodes..."
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem 0.5rem 2rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db',
              fontSize: '0.875rem',
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: 'absolute',
              left: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
            }}
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
                color: '#9ca3af',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Export Button */}
      <div className="export-button" style={{ position: 'relative' }}>
        <button
          onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
          style={{
            padding: '0.5rem 0.75rem',
            backgroundColor: '#f3f4f6',
            color: '#4b5563',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Export
        </button>
        
        {isExportMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.25rem',
              backgroundColor: '#fff',
              borderRadius: '0.375rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: '1px solid #e5e7eb',
              zIndex: 20,
              width: '120px',
            }}
          >
            <button
              onClick={() => handleExport('pdf')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                width: '100%',
                textAlign: 'left',
                fontSize: '0.875rem',
                color: '#4b5563',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Export PDF
            </button>
            <button
              onClick={() => handleExport('json')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                width: '100%',
                textAlign: 'left',
                fontSize: '0.875rem',
                color: '#4b5563',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Export JSON
            </button>
          </div>
        )}
      </div>

      {/* Reload Button */}
      {onReload && (
        <button
          onClick={onReload}
          style={{
            padding: '0.5rem',
            backgroundColor: '#f3f4f6',
            color: '#4b5563',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Reload Data"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M23 4v6h-6"></path>
            <path d="M1 20v-6h6"></path>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default ControlPanel;