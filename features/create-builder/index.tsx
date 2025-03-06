"use client";
import { useEffect } from "react";
import CreateBuilderViewsEndPoint from "./components/end-point";
import CreateBuilderCxtProvider from "./context/create-builder-cxt";
import { useCreateBuilderStore } from "./store/useCreateBuilderStore";

type PropsT = {
  btnLabel: string;
  moduleId?: string;
};

export default function CreateBuilderModule({ btnLabel, moduleId }: PropsT) {
  const { setModuleId, setBtnLabel,setOriginalModuleId, moduleId: mIId,selectedModule } = useCreateBuilderStore();

  useEffect(() => {
    if (moduleId) {
      console.log('moduleId updated')
      setModuleId(moduleId);
      setOriginalModuleId(moduleId)
    }
    if (btnLabel) setBtnLabel(btnLabel);
  }, [moduleId, btnLabel]);

  console.log("moduleIdmoduleId", mIId,moduleId,selectedModule);

  return (
    <CreateBuilderCxtProvider btnLabel={btnLabel} moduleId={moduleId}>
      <CreateBuilderViewsEndPoint />
    </CreateBuilderCxtProvider>
  );
}
