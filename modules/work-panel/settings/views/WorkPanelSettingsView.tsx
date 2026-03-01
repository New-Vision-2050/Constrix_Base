"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Settings, Calendar, BarChart3, ClipboardList } from "lucide-react";
import Link from "@i18n/link";
import { ROUTER } from "@/router";

interface SettingCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  url: string;
}

export default function WorkPanelSettingsView() {
  const settingCards: SettingCard[] = [
    {
      id: "projects-settings",
      title: "اعداد المشاريع",
      icon: <Settings className="w-8 h-8" />,
      url: ROUTER.PROJECTS_SETTINGS,
    },
    {
      id: "task-distribution",
      title: "اعداد توزيع المهام",
      icon: <ClipboardList className="w-8 h-8" />,
      url: "/work-panel-settings/task-distribution",
    },
    {
      id: "time-planning",
      title: "اعداد تخطيط الوقت",
      icon: <Calendar className="w-8 h-8" />,
      url: "/work-panel-settings/time-planning",
    },
    {
      id: "results-evaluation",
      title: "اعداد تقييم النتائج",
      icon: <BarChart3 className="w-8 h-8" />,
      url: "/work-panel-settings/results-evaluation",
    },
  ];

  return (
    <div className="px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">اعدادات لوحه العمل</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {settingCards.map((card) => (
          <Link key={card.id} href={card.url}>
            <Card className="hover:shadow-lg hover:shadow-primary/20 transition-all cursor-pointer h-full bg-gradient-to-br from-[#3d4b7a] to-[#2a3555] border-[#4a5578] text-white">
              <CardHeader className="flex flex-col items-center justify-center space-y-4 pb-4 pt-8">
                <div className="p-3 rounded-lg bg-white/10 text-white">
                  {card.icon}
                </div>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <h3 className="text-base font-medium text-white">{card.title}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
