import React, { ReactNode, ComponentProps, useState } from "react";

interface DialogTriggerProps<T extends React.ComponentType<any>> {
  /**
   * Render function for the trigger button
   * @param onOpen - Function to open the dialog
   */
  render: (props: { onOpen: VoidFunction }) => ReactNode;

  /**
   * The dialog component to render
   */
  component: T;

  /**
   * Props to pass to the dialog component
   * The component must accept 'open' and 'onClose' props
   */
  dialogProps: Omit<ComponentProps<T>, "open" | "onClose">;

  /**
   * Optional callback when dialog opens
   */
  onOpen?: VoidFunction;

  /**
   * Optional callback when dialog closes
   */
  onClose?: VoidFunction;
}

/**
 * A headless component that simplifies dialog opening on button clicks
 *
 * @example
 * ```tsx
 * <DialogTrigger
 *   component={MyDialog}
 *   dialogProps={{ title: "My Dialog", data: someData }}
 *   render={({ onOpen }) => (
 *     <Button onClick={onOpen}>Open Dialog</Button>
 *   )}
 * />
 * ```
 */
function DialogTrigger<T extends React.ComponentType<any>>({
  render,
  component: DialogComponent,
  dialogProps,
  onOpen,
  onClose,
}: DialogTriggerProps<T>) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    onOpen?.();
  };

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const combinedProps = {
    ...dialogProps,
    open,
    onClose: handleClose,
  } as ComponentProps<T>;

  return (
    <>
      {render({ onOpen: handleOpen })}
      <DialogComponent {...combinedProps} />
    </>
  );
}

export default DialogTrigger;
export type { DialogTriggerProps };
