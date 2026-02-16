"use client";

import {  useTableReload } from "@/modules/table";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useServiceListTableConfig } from "./_config/list-table-config";
import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { Building } from "lucide-react";

export default function ServicesView() {
  const [ setEditingServiceId] = useState<string | null>(null);
  const [ setActiveTab] = useState("insurance-company");
  const tableConfig = useServiceListTableConfig({
    onEdit: (id: string) => setEditingServiceId(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);
  const t = useTranslations("content-management-system.services");

  const tabs = [
    {
      id: "insurance-company",
      title: "شركه التامين",
      icon: <Building />,
      content: (
        <div className="px-8 py-12 text-center">
          <Building className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">شركه التامين</h3>
          <p className="text-gray-500">هذا القسم سيحتوي على بيانات شركات التأمين</p>
        </div>
      ),
    },
  ];

  return (
    <div className="px-8">
      <HorizontalTabs 
        list={tabs} 
        onTabClick={(tab) => setActiveTab(tab.id)}
      />
    </div>
  );
}
