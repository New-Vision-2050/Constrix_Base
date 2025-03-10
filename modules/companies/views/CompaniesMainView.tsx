"use client";
import CreateBuilderModule, {
  CreateBuilderModuleRef,
} from "@/features/create-builder";
import { useRef } from "react";

export default function CompaniesMainView() {
  const builderModuleRef = useRef<CreateBuilderModuleRef>(null);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/90" />
        <div className="aspect-video rounded-xl bg-muted/90" />
        <div className="aspect-video rounded-xl bg-muted/90" />
      </div>
      {/* <SetCompanySheet /> */}
      <hr />
      <CreateBuilderModule btnLabel="أنشاء" ref={builderModuleRef} />
      <button onClick={() => builderModuleRef.current?.closeSheet()}>
        Close Sheet
      </button>
      <CreateBuilderModule
        btnLabel="أنشاء شركة"
        moduleId={"create-company-user"}
      />
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/90 md:min-h-min" />
    </div>
  );
}
