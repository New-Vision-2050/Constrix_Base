import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, EditIcon, TrashIcon } from "lucide-react";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { useTableInstance } from "@/modules/table/store/useTableStore";
import { FormConfig, SheetFormBuilder } from "@/modules/form-builder";
import { useState, ReactNode, useMemo } from "react";
import { useTranslations } from "next-intl";

// Define types for dialog props
export interface DialogProps {
  open?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  title?: string;
  shouldReloadTable?: boolean;
  [key: string]: unknown;
}

// Define types for menu items
export type MenuItem = {
  label: string;
  icon?: ReactNode;
  action: string | ((row: { id: string; [key: string]: unknown }) => void);
  color?: string;
  // Optional component property for custom dialogs
  dialogComponent?: ReactNode | ((props: DialogProps) => ReactNode);
  dialogProps?: DialogProps;
  position?: "before" | "after";
};

// Define possible action types
export type ActionState = {
  delete?: {
    open: boolean;
    url: string;
    tableName?: string;
  };
  edit?: {
    open: boolean;
    config: FormConfig | null;
  };
  [key: string]: { open: boolean; url?: string; config?: FormConfig | null } | undefined;
};

const Execution = ({
  row,
  executions = [],
  formConfig,
  buttonLabel = "Actions",
  tableName = "",
  className = "px-5 bg-[#8785A2] hover:bg-[#8785A2] rotate-svg-child",
  showEdit = true,
  showDelete = true,
}: {
  row: { id: string; [key: string]: unknown };
  executions?: MenuItem[];
  formConfig?: FormConfig;
  buttonLabel?: string;
  tableName?: string;
  className?: string;
  showEdit?: boolean;
  showDelete?: boolean;
}) => {
  const t = useTranslations();

  const defaultMenuItems = useMemo(() => {
    const items = [];

    if (showEdit) {
      items.push({
        label: t("Companies.Edit"),
        icon: <EditIcon className="w-4 h-4" />,
        action: "edit",
      });
    }

    if (showDelete) {
      items.push({
        label: t("Companies.Delete"),
        icon: <TrashIcon className="w-4 h-4" />,
        action: "delete",
        color: "red-500",
      });
    }

    return items;
  }, [t, showEdit, showDelete]);

  const menuItems = useMemo(() => {
    const beforeItems = executions.filter((item) => item.position !== "after");
    const afterItems = executions.filter((item) => item.position === "after");

    return [...beforeItems, ...defaultMenuItems, ...afterItems];
  }, [executions, defaultMenuItems]);

  const initialState: ActionState = {
    delete: { open: false, url: "" },
    edit: {
      open: false,
      config: formConfig
        ? {
            ...formConfig,
            isEditMode: true,
            editApiUrl: formConfig.apiUrl + "/:id",
          }
        : null,
    },
  };

  menuItems.forEach((item) => {
    if (
      typeof item.action === "string" &&
      item.action !== "delete" &&
      item.action !== "edit"
    ) {
      initialState[item.action] = { open: false };
    }
  });

  const [actionState, setActionState] = useState<ActionState>(initialState);

  const { reloadTable } = useTableInstance(tableName || "companies-table");

  const handleMenuItemClick = (action: string | ((row: { id: string; [key: string]: unknown }) => void)) => {
    if (typeof action === "function") {
      action(row);
    } else {
      setActionState((prev) => ({
        ...prev,
        [action]: {
          ...prev[action],
          open: true,
          url:
            action === "delete"
              ? `${formConfig?.apiUrl}/${row.id}`
              : prev[action]?.url,
        },
      }));
    }
  };

  const handleCloseDialog = (dialogKey: string) => {
    setActionState((prev) => ({
      ...prev,
      [dialogKey]: { ...prev[dialogKey], open: false },
    }));
  };

  return (
    <>
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button className={className}>
            {buttonLabel}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {menuItems.map((item, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => handleMenuItemClick(item.action)}
              className={item.color ? `text-${item.color}` : ""}
            >
              {item.icon && <span className="me-2">{item.icon}</span>}
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      {formConfig && actionState.delete && (
        <DeleteConfirmationDialog
          deleteUrl={actionState.delete.url}
          onClose={() => handleCloseDialog("delete")}
          open={actionState.delete.open}
          onSuccess={() => {
            reloadTable();
          }}
        />
      )}

      {/* Edit Form */}
      {formConfig && actionState.edit && actionState.edit.config && (
        <SheetFormBuilder
          recordId={row.id}
          config={actionState.edit.config}
          isOpen={actionState.edit.open}
          onOpenChange={() => handleCloseDialog("edit")}
        />
      )}

      {/* Render custom dialogs based on menuItems */}
      {menuItems.map((item: MenuItem, index) => {
        // Skip if not a string action or is a built-in action
        if (
          typeof item.action !== "string" ||
          item.action === "delete" ||
          item.action === "edit"
        ) {
          return null;
        }

        // Get action state for this dialog
        const dialogState = actionState[item.action];
        if (!dialogState || !item.dialogComponent) {
          return null;
        }

        // Render the custom dialog component
        const DialogComponent = item.dialogComponent;
        return (
          <div key={`dialog-${index}`}>
            {typeof DialogComponent === "function" ? (
              <DialogComponent
                {...item.dialogProps}
                open={dialogState.open}
                onClose={() => handleCloseDialog(item.action as string)}
                onSuccess={() => {
                  if (item.dialogProps?.shouldReloadTable) {
                    reloadTable();
                  }
                }}
              />
            ) : (
              DialogComponent
            )}
          </div>
        );
      })}
    </>
  );
};

export default Execution;

/*

*****
Menu Item Example
*****

  const initMenuItems = [
    {
      label: t("Companies.LoginAsManager"),
      icon: <EnterIcon className="w-4 h-4" />,
      action: () => console.log("Login as manager clicked"),
    },
    {
      label: t("Companies.PackageSettings"),
      icon: <GearIcon className="w-4 h-4" />,
      action: "packageSettings", // Custom action key
      dialogComponent: DeleteConfirmationDialog, // Your custom dialog component
      dialogProps: {
        title: "Package Settings",
        shouldReloadTable: true, // Optional flag to reload table after success
      },
    },
    {
      label: t("Companies.Edit"),
      icon: <EditIcon className="w-4 h-4" />,
      action: "edit", // Predefined action to open edit form
    },
    {
      label: t("Companies.Delete"),
      icon: <TrashIcon className="w-4 h-4" />,
      action: "delete", // Predefined action to open delete dialog
      color: "red-500", // Optional color
    },
  ];


*/
