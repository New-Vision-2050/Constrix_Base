import { TabTemplateLoading } from "@/components/shared/TabTemplate/TabTemplateLoading";

export default function TabTemplateListLoading() {
  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="border border-slate-400 rounded-lg p-4">
          <TabTemplateLoading />
        </div>
      ))}
    </div>
  );
}
