import React, { memo, useCallback, useState, useEffect, useRef, useMemo, useReducer } from "react";
import { Button } from "@/modules/table/components/ui/button";
import { Plus } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useFormInstance } from "../../../hooks/useFormStore";

// Import components and utilities from our split files
import { DynamicRowsFieldProps } from "./types";
import { rowsReducer } from "./reducer";
import { useRowValidation } from "./useRowValidation";
import SortableRow from "./SortableRow";
import RegularRow from "./RegularRow";

const DynamicRowsField: React.FC<DynamicRowsFieldProps> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur,
  formValues = {},
  formId = 'default', // Default form ID if not provided
}) => {
  // Get the form instance
  const formInstance = useFormInstance(formId);
  const dynamicRowsConfig = field.dynamicRowsConfig;
  
  if (!dynamicRowsConfig) {
    return <div>Dynamic rows configuration is missing</div>;
  }
  
  // Initialize state with reducer
  const [state, dispatch] = useReducer(rowsReducer, {
    rows: [],
    pendingChanges: {},
    rowErrors: {}
  });
  
  // Extract state variables for easier access
  const { rows, pendingChanges, rowErrors } = state;
  
  // Use custom hook for validation
  const { validateRow, validateBasicRequirements } = useRowValidation(
    dynamicRowsConfig.fields,
    formInstance,
    field.name,
    field.label,
    dynamicRowsConfig.minRows,
    field.required,
    onBlur
  );
  
  // Initialize rows with default values or empty array
  useEffect(() => {
    if (Array.isArray(value) && value.length > 0) {
      dispatch({ type: 'SET_ROWS', rows: value });
    } else if (dynamicRowsConfig.minRows && dynamicRowsConfig.minRows > 0) {
      // Initialize with minimum number of rows if specified
      const defaultRows = Array(dynamicRowsConfig.minRows)
        .fill(null)
        .map(() => ({ ...dynamicRowsConfig.defaultRowValues, _id: `row-${Date.now()}-${Math.random()}` }));
      
      dispatch({ type: 'SET_ROWS', rows: defaultRows });
    }
  }, []);
  
  // Reset rows when value is reset (e.g., when form is closed or reset)
  useEffect(() => {
    // Check if value is empty or reset
    if (!Array.isArray(value) || value.length === 0) {
      // Reset to default state
      if (dynamicRowsConfig.minRows && dynamicRowsConfig.minRows > 0) {
        const defaultRows = Array(dynamicRowsConfig.minRows)
          .fill(null)
          .map(() => ({ ...dynamicRowsConfig.defaultRowValues, _id: `row-${Date.now()}-${Math.random()}` }));
        
        dispatch({ type: 'RESET', defaultRows });
      } else {
        dispatch({ type: 'RESET', defaultRows: [] });
      }
    }
  }, [value, dynamicRowsConfig.minRows, dynamicRowsConfig.defaultRowValues]);
  
  // Use a debounced update to prevent too many re-renders of the parent form
  const [debouncedRows, setDebouncedRows] = useState(rows);
  
  // Only update the parent form when rows have stabilized (after 300ms of no changes)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedRows(rows);
    }, 300);
    
    return () => {
      clearTimeout(handler);
    };
  }, [rows]);
  
  // Only update the parent form when debouncedRows change
  useEffect(() => {
    // Update the parent form with the rows
    onChange(debouncedRows);
  }, [debouncedRows, onChange]);
  
  // Add an additional effect to validate when touched changes
  // This ensures validation happens when form is submitted
  useEffect(() => {
    if (touched) {
      // We need to avoid calling validateAllRows directly in the effect
      // as it can cause an infinite loop due to form store updates
      setTimeout(() => {
        // Skip validation during form submission
        // Only check if the field is required and empty for basic validation
        validateBasicRequirements(rows);
      }, 0);
    }
  }, [touched, rows, validateBasicRequirements]);
  
  // Apply pending changes to rows after a delay
  // This is now mainly used for batching updates to the parent form
  useEffect(() => {
    if (Object.keys(pendingChanges).length === 0) return;
    
    // We don't need to update rows here anymore since we're doing it immediately in handleFieldChange
    // But we still want to clear the pending changes after a delay to batch updates
    const handler = setTimeout(() => {
      // Clear pending changes after the delay
      dispatch({ type: 'CLEAR_PENDING_CHANGES' });
    }, 100);
    
    return () => {
      clearTimeout(handler);
    };
  }, [pendingChanges]);
  
  // Use a ref to track if we're in the middle of a row operation
  const isOperatingRef = useRef(false);
  
  // Handle adding a new row with debounce
  const handleAddRow = useCallback(() => {
    const maxRows = dynamicRowsConfig.maxRows || Infinity;
    
    if (rows.length < maxRows && !isOperatingRef.current) {
      isOperatingRef.current = true;
      
      // Use setTimeout to batch updates
      setTimeout(() => {
        dispatch({
          type: 'ADD_ROW',
          defaultValues: { ...dynamicRowsConfig.defaultRowValues }
        });
        
        isOperatingRef.current = false;
      }, 50);
    }
  }, [rows.length, dynamicRowsConfig.maxRows, dynamicRowsConfig.defaultRowValues]);
  
  // Handle deleting a row with debounce
  const handleDeleteRow = useCallback((rowIndex: number) => {
    const minRows = dynamicRowsConfig.minRows || 0;
    
    if (rows.length > minRows && !isOperatingRef.current) {
      isOperatingRef.current = true;
      
      // Use setTimeout to batch updates
      setTimeout(() => {
        dispatch({ type: 'DELETE_ROW', rowIndex });
        isOperatingRef.current = false;
      }, 50);
    }
  }, [rows.length, dynamicRowsConfig.minRows]);
  
  // Handle field value changes - store in pendingChanges first
  const handleFieldChange = useCallback((rowIndex: number, fieldName: string, fieldValue: any) => {
    // Update the row data
    dispatch({
      type: 'UPDATE_ROW',
      rowIndex,
      fieldName,
      value: fieldValue
    });
    
    // Only validate during field changes, not during form submission
    // This allows the form to be submitted without validating dynamic rows
    if (touched && !formInstance.isSubmitting) {
      setTimeout(() => {
        const updatedRow = {
          ...rows[rowIndex],
          [fieldName]: fieldValue
        };
        
        const { isValid, rowFieldErrors } = validateRow(rowIndex, updatedRow, rows);
        
        // Update row errors
        const newRowErrors = { ...rowErrors };
        newRowErrors[rowIndex] = rowFieldErrors;
        dispatch({ type: 'SET_ROW_ERRORS', rowErrors: newRowErrors });
        
        // If validation fails, report the error to the form store
        if (!isValid) {
          // Set the error in the form store
          formInstance.setError(field.name, `${field.label} has validation errors in row ${rowIndex + 1}`);
          
          // This will prevent form submission
          onBlur();
        } else {
          // Check basic requirements
          validateBasicRequirements(rows);
        }
      }, 0);
    }
  }, [rows, touched, formInstance, validateRow, validateBasicRequirements, field.name, field.label, onBlur, rowErrors]);

  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end event with debounce
  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id && !isOperatingRef.current) {
      isOperatingRef.current = true;
      
      // Find indices
      const oldIndex = rows.findIndex((row: any) => row._id === active.id);
      const newIndex = rows.findIndex((row: any) => row._id === over.id);
      
      // Use setTimeout to batch updates
      setTimeout(() => {
        dispatch({
          type: 'MOVE_ROW',
          oldIndex,
          newIndex
        });
        
        isOperatingRef.current = false;
      }, 50);
    }
  }, [rows]);

  // Generate row IDs for sortable context
  const rowIds = rows.map((row: any) => row._id || `row-${Math.random()}`);
  
  // Check if delete button should be disabled
  const isDeleteDisabled = rows.length <= (dynamicRowsConfig.minRows || 0);
  
  // Check if add button should be disabled
  const isAddDisabled = dynamicRowsConfig.maxRows ? rows.length >= dynamicRowsConfig.maxRows : false;

  // Memoize the rendered content to prevent unnecessary re-renders
  const renderedContent = useMemo(() => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          {dynamicRowsConfig.sortable ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
                {rows.map((row: any, index: number) => (
                  <SortableRow
                    key={row._id || index}
                    id={row._id || `row-${index}`}
                    rowIndex={index}
                    rowData={row}
                    fields={dynamicRowsConfig.fields}
                    onFieldChange={handleFieldChange}
                    onDeleteRow={handleDeleteRow}
                    isDeleteDisabled={isDeleteDisabled}
                    rowErrors={rowErrors[index]}
                    columnsPerRow={dynamicRowsConfig.columnsPerRow}
                  />
                ))}
              </SortableContext>
            </DndContext>
          ) : (
            // Non-sortable version
            <div className="space-y-2">
              {rows.map((row: any, index: number) => (
                <RegularRow
                  key={row._id || index}
                  rowIndex={index}
                  rowData={row}
                  fields={dynamicRowsConfig.fields}
                  onFieldChange={handleFieldChange}
                  onDeleteRow={handleDeleteRow}
                  isDeleteDisabled={isDeleteDisabled}
                  rowErrors={rowErrors[index]}
                  columnsPerRow={dynamicRowsConfig.columnsPerRow}
                  touched={touched}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddRow}
            disabled={isAddDisabled}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            {dynamicRowsConfig.addRowButtonText || "Add Row"}
          </Button>
          
          {/* Display error message - show when form is submitted or when field is required and empty */}
          {((error && touched) || (field.required && (!rows || rows.length === 0))) && (
            <p className="text-sm text-destructive mt-1 font-medium">
              {error || (field.required && (!rows || rows.length === 0) ? `${field.label} is required` : '')}
            </p>
          )}
        </div>
      </div>
    );
  }, [
    // Dependencies for the useMemo hook
    dynamicRowsConfig.sortable,
    dynamicRowsConfig.fields,
    dynamicRowsConfig.addRowButtonText,
    dynamicRowsConfig.columnsPerRow,
    rows,
    rowIds,
    sensors,
    handleDragEnd,
    handleFieldChange,
    handleDeleteRow,
    handleAddRow,
    isDeleteDisabled,
    isAddDisabled,
    error,
    touched,
    rowErrors,
    // Include Object.keys(rowErrors).length to ensure re-render when specific row errors change
    Object.keys(rowErrors).length,
    // Include state to ensure re-render when state changes
    state
  ]);
  
  return renderedContent;
};

// Create a specialized props comparison function for memo
const propsAreEqual = (prevProps: DynamicRowsFieldProps, nextProps: DynamicRowsFieldProps) => {
  // Only re-render if these specific props change
  return (
    prevProps.field === nextProps.field &&
    prevProps.error === nextProps.error &&
    prevProps.touched === nextProps.touched &&
    // For value, we do a shallow comparison of arrays
    (
      (!Array.isArray(prevProps.value) && !Array.isArray(nextProps.value)) ||
      (Array.isArray(prevProps.value) && Array.isArray(nextProps.value) &&
       prevProps.value.length === nextProps.value.length)
    )
    // We intentionally don't compare onChange and onBlur as they're function references
  );
};

// Export with memo and custom comparison function
export default memo(DynamicRowsField, propsAreEqual);