import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FieldConfig } from "../../types/formTypes";
import { useFormInstance } from "../../hooks/useFormStore";
import { cn } from "@/lib/utils";
import { Trash2, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { useLocale } from "next-intl";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import InfoIcon from "@/public/icons/info";
import FormField from "../../components/FormField";

// Define a ref type for the component
export interface DynamicRowsFieldRef {
  validateAllRows: () => boolean;
}

interface DynamicRowsFieldProps {
  field: FieldConfig & {
    rowTemplate?: Record<string, any>; // Template for new rows
    rowFields?: FieldConfig[]; // Fields to display for each row
    minRows?: number; // Minimum number of rows
    maxRows?: number; // Maximum number of rows
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

  // State for delete confirmation
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Ensure value is an array
  const rows = useMemo(() => {
    return Array.isArray(value) ? value : [];
  }, [value]);

  // Default row template
  const defaultRowTemplate = useMemo(() => {
    return field.rowTemplate || {};
  }, [field.rowTemplate]);

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
    return !field.maxRows || rows.length < field.maxRows;
  }, [field.maxRows, rows.length]);

  // Check if we can delete rows
  const canDeleteRow = useMemo(() => {
    return !field.minRows || rows.length > field.minRows;
  }, [field.minRows, rows.length]);

  // Validate all rows
  const validateAllRows = useCallback(() => {
    if (!field.rowFields) return true;

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

      // Mark all fields as touched
      if (field.rowFields) {
        field.rowFields.forEach(rowField => {
          row.touched[rowField.name] = true;
        });

        // Validate each field in the row
        field.rowFields.forEach(rowField => {
          if (rowField.required && (!row[rowField.name] || row[rowField.name] === '')) {
            row.errors[rowField.name] = `${rowField.label} is required`;
            isValid = false;
          }

          // Add more validation rules as needed
        });
      }
    });

    // Update rows with validation results
    onChange(newRows);

    return isValid;
  }, [field.rowFields, rows, onChange]);

  // Expose validateAllRows to parent component through ref
  React.useImperativeHandle(ref, () => ({
    validateAllRows
  }), [validateAllRows]);

  return (
    <div className={cn("w-full", field.containerClassName)}>
      <div className="space-y-6">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-lg bg-muted/30">
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
                className={cn(
                  "flex flex-col p-5 border rounded-lg transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-5",
                  hasErrors
                    ? "border-destructive/50 bg-destructive/5"
                    : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
                )}
              >
                {/* Row header with index and actions */}
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/50">
                  <div className="flex items-center">
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
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {field.rowFields?.map((rowField) => {
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
                            // Mark field as touched on blur
                            const newRows = [...rows];
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
