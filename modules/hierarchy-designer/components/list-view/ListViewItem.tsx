"use client";

import React from 'react';
import { HierarchyNode, ListViewOptions } from '../../types/hierarchyTypes';
import { motion } from 'framer-motion';

interface ListViewItemProps {
  node: HierarchyNode;
  level: number;
  isExpanded: boolean;
  isSelected: boolean;
  expandedFields: string[];
  options?: ListViewOptions;
  onToggleExpand: () => void;
  onSelect?: (node: HierarchyNode) => void;
  onEdit?: (updates: Partial<HierarchyNode>) => void;
  onDelete?: () => void;
  onFocusInTree?: () => void;
}

/**
 * List view item component for displaying a single node in the list
 * 
 * @param props Component props
 * @returns React component
 */
const ListViewItem: React.FC<ListViewItemProps> = ({
  node,
  level,
  isExpanded,
  isSelected,
  expandedFields,
  options,
  onToggleExpand,
  onSelect,
  onEdit,
  onDelete,
  onFocusInTree,
}) => {
  // Default options
  const {
    showActions = true,
    showStatus = true,
    rowHeight = 48,
    expandedHeight = 200,
    animationDuration = 0.3,
    showChildrenCount = true,
  } = options || {};

  // Format date fields
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  // Format field value based on type
  const formatFieldValue = (field: string, value: any) => {
    if (value === undefined || value === null) return '-';
    
    if (field.includes('date') || field.includes('Date') || field.includes('At')) {
      return formatDate(value);
    }
    
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    return value.toString();
  };

  return (
    <div
      className={`list-view-item ${isSelected ? 'selected' : ''}`}
      style={{
        marginLeft: `${level * 16}px`,
        marginBottom: '0.5rem',
        borderRadius: '0.375rem',
        border: '1px solid #e5e7eb',
        backgroundColor: isSelected ? '#f0f9ff' : '#fff',
        overflow: 'hidden',
      }}
    >
      {/* Header row (always visible) */}
      <div
        className="list-view-item-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 1rem',
          height: `${rowHeight}px`,
          cursor: onSelect ? 'pointer' : 'default',
          borderBottom: isExpanded ? '1px solid #e5e7eb' : 'none',
        }}
        onClick={onSelect ? () => onSelect(node) : undefined}
      >
        {/* Expand/collapse button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem',
            marginRight: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={isExpanded ? 'Collapse' : 'Expand'}
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
            style={{
              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        {/* Node name */}
        <div
          className="list-view-item-name"
          style={{
            fontWeight: 500,
            flex: 1,
          }}
        >
          {node.name}
          
          {/* Children count */}
          {showChildrenCount && node.children && node.children.length > 0 && (
            <span
              style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                marginLeft: '0.5rem',
                fontWeight: 400,
              }}
            >
              ({node.children.length})
            </span>
          )}
        </div>

        {/* Status */}
        {showStatus && node.status && (
          <div
            className="list-view-item-status"
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 500,
              backgroundColor: 
                node.status === 'active' ? '#dcfce7' :
                node.status === 'inactive' ? '#f3f4f6' :
                node.status === 'pending' ? '#fef9c3' :
                node.status === 'error' ? '#fee2e2' :
                '#e5e7eb',
              color: 
                node.status === 'active' ? '#166534' :
                node.status === 'inactive' ? '#4b5563' :
                node.status === 'pending' ? '#854d0e' :
                node.status === 'error' ? '#b91c1c' :
                '#374151',
              marginRight: '1rem',
            }}
          >
            {node.status}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="list-view-item-actions" style={{ display: 'flex', gap: '0.5rem' }}>
            {/* Edit button */}
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // In a real implementation, this would open an edit dialog
                  console.log('Edit node:', node.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  color: '#6b7280',
                }}
                title="Edit"
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
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            )}

            {/* Delete button */}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // In a real implementation, this would open a confirmation dialog
                  if (window.confirm(`Are you sure you want to delete "${node.name}"?`)) {
                    onDelete();
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  color: '#6b7280',
                }}
                title="Delete"
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
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            )}

            {/* Focus in tree button */}
            {onFocusInTree && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFocusInTree();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  color: '#6b7280',
                }}
                title="Focus in Tree View"
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
                  <path d="M12 3v18M5 7h14M3 11h18M5 15h14M8 19h8"></path>
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: animationDuration }}
          className="list-view-item-content"
          style={{
            padding: '1rem',
            backgroundColor: '#f9fafb',
          }}
        >
          <div
            className="list-view-item-fields"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            {/* Description (if available) */}
            {node.description && (
              <div
                className="list-view-item-description"
                style={{
                  gridColumn: '1 / -1',
                  marginBottom: '0.5rem',
                }}
              >
                <div style={{ fontWeight: 500, marginBottom: '0.25rem', color: '#4b5563' }}>
                  Description
                </div>
                <div style={{ color: '#6b7280' }}>{node.description}</div>
              </div>
            )}

            {/* Other fields */}
            {expandedFields.map((field) => {
              // Skip fields that are already shown or don't exist
              if (
                ['id', 'name', 'description', 'children', 'status'].includes(field) ||
                node[field] === undefined
              ) {
                return null;
              }

              return (
                <div key={field} className="list-view-item-field">
                  <div style={{ fontWeight: 500, marginBottom: '0.25rem', color: '#4b5563' }}>
                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                  </div>
                  <div style={{ color: '#6b7280' }}>{formatFieldValue(field, node[field])}</div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ListViewItem;