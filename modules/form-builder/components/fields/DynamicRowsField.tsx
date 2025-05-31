import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FieldConfig, DynamicRowOptions } from "../../types/formTypes";
import { useFormInstance, useFormStore } from "../../hooks/useFormStore";
import { cn } from "@/lib/utils";
import { Trash2, ArrowUp, ArrowDown, Plus, GripVertical } from "lucide-react";
import { useLocale } from "next-intl";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import InfoIcon from "@/public/icons/info";
import FormField from "../../components/FormField";

// Define a ref type for the component
export interface DynamicRowsFieldRef {
  validateAllRows: () => boolean;
}

/**
 * DynamicRowsField Component
 *
 * A form field component that allows users to add, delete, and sort rows of JSON data.
 *
 * Features:
 * - Add/remove rows with validation
 * - Reorder rows with up/down buttons or drag-and-drop
 * - Customizable row templates
 * - Comprehensive field-level validation with support for multiple validation rules
 * - Form submission prevention when validation fails
 * - Configurable minimum and maximum rows
 * - Customizable styling with transparent backgrounds
 *
 * Configuration options (via dynamicRowOptions):
 * - rowFields: Fields to display for each row
 * - rowTemplate: Optional template for new rows (will be auto-generated from rowFields if not provided)
 * - minRows/maxRows: Limits on number of rows
 * - columns: Number of columns for all screen sizes
 * - columnsSmall/columnsMedium/columnsLarge: Responsive column counts
 * - rowBgColor: Optional CSS class for row background
 * - rowHeaderBgColor: Optional CSS class for row header background
 * - enableDrag: Enable drag-and-drop reordering of rows
 * - dragHandlePosition: Position of the drag handle (default: 'left')
 */

// DynamicRowOptions interface is now imported from formTypes.ts

interface DynamicRowsFieldProps {
  field: FieldConfig & {
    dynamicRowOptions?: DynamicRowOptions;
  };
  value: any[];
  error?: string | React.ReactNode;
  touched?: boolean;
  onChange: (value: any[]) => void;
  onBlur: () => void;
  formId?: string;
}

interface DeleteConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

// Enhanced delete confirmation dialog
const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  open,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-destructive/20">
        <DialogHeader className="items-center justify-center mb-6">
          <div className="bg-destructive/10 p-3 rounded-full mb-4 flex items-center justify-center">
            <InfoIcon />
          </div>
          <DialogTitle className="text-xl font-semibold">
            تأكيد الحذف
          </DialogTitle>
          <button
            className="absolute top-4 rtl:left-4 ltr:right-4 text-gray-400 hover:text-destructive transition-colors"
            onClick={onClose}
          >
            ✕
          </button>
        </DialogHeader>
        <div className="text-center text-muted-foreground mb-6 px-4">
          هل انت متاكد تريد الحذف؟ لا يمكن التراجع عن هذا الإجراء.
        </div>
        <DialogFooter className="!items-center !justify-center gap-3 pt-2">
          <Button
            onClick={onConfirm}
            loading={isLoading}
            variant="destructive"
            className="w-32 h-10 transition-all duration-200"
          >
            تأكيد الحذف
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-32 h-10 border-muted-foreground/30 hover:bg-muted/50"
          >
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DynamicRowsField = React.forwardRef<DynamicRowsFieldRef, DynamicRowsFieldProps>(({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur,
  formId = 'default',
}, ref) => {
  // Get the current locale to determine text direction
  const locale = useLocale();
  const isRtl = locale === "ar";

  // Get form instance from the store
  const formInstance = useFormInstance(formId);

  // Get dynamic row options with defaults
  const options = useMemo(() => {
    return field.dynamicRowOptions || {};
  }, [field.dynamicRowOptions]);

  // State for delete confirmation
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for drag and drop
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Ensure value is an array
  const rows = useMemo(() => {
    return Array.isArray(value) ? value : [];
  }, [value]);

  // Generate default row template from rowFields if not provided
  const defaultRowTemplate = useMemo(() => {
    if (options.rowTemplate) {
      return options.rowTemplate;
    }

    // If no template is provided, create one from rowFields
    if (options.rowFields) {
      const template: Record<string, any> = {};
      options.rowFields.forEach(field => {
        // Set default values based on field type
        switch (field.type) {
          case 'text':
          case 'email':
          case 'password':
          case 'textarea':
          case 'search':
          case 'phone':
            template[field.name] = '';
            break;
          case 'number':
            template[field.name] = 0;
            break;
          case 'checkbox':
            template[field.name] = false;
            break;
          case 'date':
            template[field.name] = '';
            break;
          case 'select':
          case 'radio':
            // If options are available, use the first option's value as default
            if (field.options && field.options.length > 0) {
              template[field.name] = field.options[0].value;
            } else {
              template[field.name] = '';
            }
            break;
          case 'multiSelect':
            template[field.name] = [];
            break;
          default:
            template[field.name] = '';
        }
      });
      return template;
    }

    return {};
  }, [options.rowTemplate, options.rowFields]);

  // Add a new row
  const handleAddRow = useCallback(() => {
    const newRows = [
      ...rows,
      {
        ...defaultRowTemplate,
        id: Date.now(),
        errors: {},
        touched: {}
      }
    ];
    onChange(newRows);
  }, [rows, onChange, defaultRowTemplate]);

  // Delete a row
  const handleDeleteRow = useCallback((index: number) => {
    setDeleteIndex(index);
  }, []);

  // Confirm row deletion
  const confirmDelete = useCallback(() => {
    if (deleteIndex !== null) {
      setIsDeleting(true);
      const newRows = [...rows];
      newRows.splice(deleteIndex, 1);
      onChange(newRows);
      setIsDeleting(false);
      setDeleteIndex(null);
    }
  }, [deleteIndex, rows, onChange]);

  // Cancel row deletion
  const cancelDelete = useCallback(() => {
    setDeleteIndex(null);
  }, []);

  // Move row up
  const moveRowUp = useCallback((index: number) => {
    if (index <= 0) return;

    const newRows = [...rows];
    const temp = newRows[index];
    newRows[index] = newRows[index - 1];
    newRows[index - 1] = temp;

    onChange(newRows);
  }, [rows, onChange]);

  // Move row down
  const moveRowDown = useCallback((index: number) => {
    if (index >= rows.length - 1) return;

    const newRows = [...rows];
    const temp = newRows[index];
    newRows[index] = newRows[index + 1];
    newRows[index + 1] = temp;

    onChange(newRows);
  }, [rows, onChange]);

  // Drag handlers
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggedIndex(index);
    if (options.onDragStart) {
      options.onDragStart(index);
    }
  }, [options]);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDragLeave = useCallback(() => {
    // Optional: Add visual feedback when dragging leaves an item
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    const draggedIdx = Number(e.dataTransfer.getData('text/plain'));

    if (isNaN(draggedIdx) || draggedIdx === index) return;

    // Reorder the rows
    const newRows = [...rows];
    const draggedItem = newRows[draggedIdx];

    // Remove the dragged item
    newRows.splice(draggedIdx, 1);

    // Insert at the new position
    newRows.splice(index, 0, draggedItem);

    // Update state
    onChange(newRows);

    // Reset drag state
    setDraggedIndex(null);
    setDragOverIndex(null);

    // Call the callback if provided
    if (options.onDragEnd) {
      options.onDragEnd(draggedIdx, index);
    }
  }, [rows, onChange, options]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  // Update a specific field in a row
  const updateRowField = useCallback((rowIndex: number, fieldName: string, fieldValue: any) => {
    const newRows = [...rows];

    // Initialize errors object if it doesn't exist
    if (!newRows[rowIndex].errors) {
      newRows[rowIndex].errors = {};
    }

    // Clear error for this field when value changes
    if (newRows[rowIndex].errors[fieldName]) {
      newRows[rowIndex].errors[fieldName] = null;
    }

    // Update the field value
    newRows[rowIndex] = {
      ...newRows[rowIndex],
      [fieldName]: fieldValue
    };

    onChange(newRows);
  }, [rows, onChange]);

  // Validate a field in a row
  const validateRowField = useCallback((rowIndex: number, fieldName: string, fieldValue: any, rules?: any[]) => {
    if (!rules || rules.length === 0) return null;

    // Simple validation logic - can be expanded as needed
    for (const rule of rules) {
      if (rule.type === 'required' && (!fieldValue || fieldValue === '')) {
        return rule.message;
      }
    }

    return null;
  }, []);

  // Check if we can add more rows
  const canAddRow = useMemo(() => {
    // If enableAdd is explicitly set, use that value
    if (options.enableAdd !== undefined) {
      return options.enableAdd;
    }
    // Otherwise, use the traditional maxRows constraint check
    return !options.maxRows || rows.length < options.maxRows;
  }, [options.maxRows, options.enableAdd, rows.length]);

  // Check if we can delete rows
  const canDeleteRow = useMemo(() => {
    // If enableRemove is explicitly set, use that value
    if (options.enableRemove !== undefined) {
      return options.enableRemove;
    }
    // Otherwise, use the traditional minRows constraint check
    return !options.minRows || rows.length > options.minRows;
  }, [options.minRows, options.enableRemove, rows.length]);

  // Validate all rows
  const validateAllRows = useCallback(() => {
    if (!options.rowFields) return true;

    let isValid = true;
    const newRows = [...rows];

    // Validate each row
    newRows.forEach((row, rowIndex) => {
      // Initialize errors object if it doesn't exist
      if (!row.errors) {
        row.errors = {};
      }

      // Initialize touched object if it doesn't exist
      if (!row.touched) {
        row.touched = {};
      }

      // Mark all fields as touched during validation
      // This ensures errors are displayed even if the user hasn't interacted with the field
      if (options.rowFields) {
        options.rowFields.forEach(rowField => {
          row.touched[rowField.name] = true;

          // Clear previous errors for this field
          row.errors[rowField.name] = null;

          // Required field validation
          if (rowField.required && (row[rowField.name] === undefined || row[rowField.name] === null || row[rowField.name] === '')) {
            row.errors[rowField.name] = `${rowField.label} is required`;
            isValid = false;
          }

          // Apply custom validation rules if defined
          if (rowField.validation && Array.isArray(rowField.validation)) {
            for (const rule of rowField.validation) {
              // Skip if already has error or if it's a required rule (already handled)
              if (row.errors[rowField.name] || rule.type === 'required') continue;

              let validationFailed = false;

              switch (rule.type) {
                case 'minLength':
                  if (typeof row[rowField.name] === 'string' && row[rowField.name].length < rule.value) {
                    validationFailed = true;
                  }
                  break;
                case 'maxLength':
                  if (typeof row[rowField.name] === 'string' && row[rowField.name].length > rule.value) {
                    validationFailed = true;
                  }
                  break;
                case 'min':
                  if (typeof row[rowField.name] === 'number' && row[rowField.name] < rule.value) {
                    validationFailed = true;
                  }
                  break;
                case 'max':
                  if (typeof row[rowField.name] === 'number' && row[rowField.name] > rule.value) {
                    validationFailed = true;
                  }
                  break;
                case 'pattern':
                  if (typeof row[rowField.name] === 'string' && !new RegExp(rule.value).test(row[rowField.name])) {
                    validationFailed = true;
                  }
                  break;
                case 'custom':
                  if (rule.validator && !rule.validator(row[rowField.name], row)) {
                    validationFailed = true;
                  }
                  break;
              }

              if (validationFailed) {
                row.errors[rowField.name] = rule.message;
                isValid = false;
              }
            }
          }
        });
      }
    });

    // Update rows with validation results
    onChange(newRows);

    // If validation failed, set the field error to indicate the dynamic rows have errors
    if (!isValid && formInstance) {
      formInstance.setError(field.name, `One or more ${field.label || 'rows'} have validation errors`);
    } else if (formInstance) {
      // Clear the error by setting it to null
      formInstance.setError(field.name, null);
    }

    return isValid;
  }, [options.rowFields, rows, onChange, field.name, field.label, formInstance]);

  // Generate grid column classes based on configuration
  const getGridColumnClasses = useCallback(() => {
    // If a single columns value is provided, use it for all screen sizes
    if (options.columns) {
      return `grid-cols-${options.columns}`;
    }

    // Otherwise, use responsive column values or defaults
    const smallCols = options.columnsSmall ? `grid-cols-${options.columnsSmall}` : "grid-cols-1";
    const mediumCols = options.columnsMedium ? `md:grid-cols-${options.columnsMedium}` : "md:grid-cols-2";
    const largeCols = options.columnsLarge ? `lg:grid-cols-${options.columnsLarge}` : "lg:grid-cols-3";

    return `${smallCols} ${mediumCols} ${largeCols}`;
  }, [options.columns, options.columnsSmall, options.columnsMedium, options.columnsLarge]);

  // Expose validateAllRows to parent component through ref
  React.useImperativeHandle(ref, () => ({
    validateAllRows
  }), [validateAllRows]);

  return (
    <div className={cn("w-full", field.containerClassName)}>
      <div className="space-y-6">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-lg bg-transparent">
            <div className="text-muted-foreground text-center mb-4">
              <p className="text-sm">لا توجد بيانات حتى الآن</p>
              <p className="text-xs mt-1">أضف {field.label || 'صف جديد'} للبدء</p>
            </div>
          </div>
        ) : (
          rows.map((row, index) => {
            // Determine if the row has any errors
            const hasErrors = row.errors && Object.values(row.errors).some(error => !!error);

            return (
              <div
                key={row.id || index}
                draggable={!!options.enableDrag}
                onDragStart={options.enableDrag ? (e) => handleDragStart(e, index) : undefined}
                onDragOver={options.enableDrag ? (e) => handleDragOver(e, index) : undefined}
                onDragEnter={options.enableDrag ? handleDragEnter : undefined}
                onDragLeave={options.enableDrag ? handleDragLeave : undefined}
                onDrop={options.enableDrag ? (e) => handleDrop(e, index) : undefined}
                onDragEnd={options.enableDrag ? handleDragEnd : undefined}
                className={cn(
                  "flex flex-col p-5 border rounded-lg transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-5",
                  hasErrors
                    ? "border-destructive/50 bg-destructive/5"
                    : options.rowBgColor
                      ? `border-border ${options.rowBgColor} hover:border-primary/30 hover:shadow-sm`
                      : "border-border bg-transparent hover:border-primary/30 hover:shadow-sm",
                  draggedIndex === index && "opacity-50",
                  dragOverIndex === index && "border-primary border-2"
                )}
              >
                {/* Row header with index and actions */}
                <div className={cn(
                  "flex items-center justify-between mb-4 pb-2 border-b border-border/50",
                  options.rowHeaderBgColor
                )}>
                  <div className="flex items-center">
                    {options.enableDrag && (
                      <div
                        className="cursor-grab active:cursor-grabbing mr-2 text-muted-foreground hover:text-primary"
                        title="Drag to reorder"
                      >
                        <GripVertical className="h-4 w-4" />
                      </div>
                    )}
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-sm font-medium mr-2">
                      {index + 1}
                    </span>
                    <h4 className="text-sm font-medium text-foreground">
                      {field.label} {index + 1}
                    </h4>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveRowUp(index)}
                      disabled={index === 0}
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      title="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveRowDown(index)}
                      disabled={index === rows.length - 1}
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      title="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    {canDeleteRow && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRow(index)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        title="Delete row"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Row fields */}
                <div className={cn("flex-1 grid gap-5", getGridColumnClasses())}>
                  {options.rowFields?.map((rowField) => {
                    const fieldKey = rowField.name;
                    return (
                      <div key={fieldKey} className="flex flex-col">
                        <FormField
                          formId={formId}
                          key={fieldKey}
                          values={row}
                          field={rowField}
                          value={row[fieldKey] || ''}
                          error={row.errors?.[fieldKey]}
                          touched={row.touched?.[fieldKey]}
                          onChange={(fieldName, fieldValue) => updateRowField(index, fieldName, fieldValue)}
                          onBlur={() => {
                          const {data} = useFormStore.getState().getValues(formId);
                            // Mark field as touched on blur
                            const newRows = [...data]
                            if (!newRows[index].touched) {
                              newRows[index].touched = {};
                            }
                            newRows[index].touched[fieldKey] = true;

                            // Validate field on blur if required
                            if (rowField.required && (!row[fieldKey] || row[fieldKey] === '')) {
                              if (!newRows[index].errors) {
                                newRows[index].errors = {};
                              }
                              newRows[index].errors[fieldKey] = `${rowField.label} is required`;
                            }

                            onChange(newRows);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {canAddRow && (
        <div className="mt-6 flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="group relative overflow-hidden border-dashed border-primary/40 hover:border-primary transition-all duration-300 px-6"
            onClick={handleAddRow}
          >
            <span className="absolute inset-0 bg-primary/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            <Plus className="h-4 w-4 mr-2 text-primary" />
            <span>إضافة {field.label || 'صف جديد'}</span>
          </Button>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <DeleteConfirmation
        open={deleteIndex !== null}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
});

export default DynamicRowsField;
