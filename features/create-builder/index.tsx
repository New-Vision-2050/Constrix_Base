"use client";
import { forwardRef, useImperativeHandle, useState } from "react";
import CreateBuilderViewsEndPoint from "./components/end-point";
import CreateBuilderCxtProvider from "./context/create-builder-cxt";

type PropsT = {
  btnLabel: string;
  moduleId?: string;
  onSheetClose?: () => void;
};

export type CreateBuilderModuleRef = {
  closeSheet: () => void;
};

const CreateBuilderModule = forwardRef<CreateBuilderModuleRef, PropsT>(
  ({ btnLabel, moduleId, onSheetClose }, ref) => {
    // Control open/close sheet
    const [isOpen, setIsOpen] = useState(false);

    // Allow parent to close the sheet
    useImperativeHandle(ref, () => ({
      closeSheet: () => {
        if (!isOpen) console.log("Sheet is already closed");
        setIsOpen(false);
      },
    }));

    return (
      <CreateBuilderCxtProvider
        btnLabel={btnLabel}
        moduleId={moduleId}
        onSheetClose={onSheetClose}
      >
        <CreateBuilderViewsEndPoint isOpen={isOpen} setIsOpen={setIsOpen} />
      </CreateBuilderCxtProvider>
    );
  }
);

// Add display name to fix React warning
CreateBuilderModule.displayName = "CreateBuilderModule";

export default CreateBuilderModule;
