import React from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Settings, SlidersHorizontal, Users, FileText, BarChart} from "lucide-react";

export default function WorkPanelSettingsPage() {
    const settingsCards = [
        {
            id: "project-settings",
            title: "اعداد المشاريع",
            icon: Users,
        },
        {
            id: "task-distribution",
            title: "اعداد توزيع المهام",
            icon: SlidersHorizontal,
        },
        {
            id: "time-planning",
            title: "اعداد تخطيط الوقت",
            icon: Settings,
        },

        {
            id: "results-evaluation",
            title: "اعداد تقييم النتائج",
            icon: FileText,
        },
    ];

    return (
        <div
            className="min-h-screen bg-gradient-to-br relative overflow-hidden">
            {/* Stars background effect */}
            <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full opacity-20"></div>
                <div className="absolute top-20 left-32 w-1 h-1 bg-white rounded-full opacity-30"></div>
                <div className="absolute top-16 right-20 w-1 h-1 bg-white rounded-full opacity-25"></div>
                <div className="absolute top-32 right-40 w-1 h-1 bg-white rounded-full opacity-15"></div>
                <div className="absolute top-40 left-60 w-1 h-1 bg-white rounded-full opacity-20"></div>
                <div className="absolute top-8 right-60 w-1 h-1 bg-white rounded-full opacity-10"></div>
                <div className="absolute top-28 left-80 w-1 h-1 bg-white rounded-full opacity-25"></div>
                <div className="absolute top-36 right-80 w-1 h-1 bg-white rounded-full opacity-15"></div>
                <div className="absolute top-24 left-40 w-1 h-1 bg-white rounded-full opacity-20"></div>
                <div className="absolute top-44 right-32 w-1 h-1 bg-white rounded-full opacity-30"></div>
            </div>

            <div className="relative z-10 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {settingsCards.map((card) => {
                            const Icon = card.icon;
                            return (
                                <Card
                                    key={card.id}
                                    className="bg-[#29285E] backdrop-blur-sm  hover:bg-blue-800/90 transition-all pb-3 duration-300 cursor-pointer shadow-xl"
                                >
                                    <CardHeader className="pb-4">
                                        <div
                                            className="w-10  rounded-xl flex items-center justify-center mb-4 border border-[#29285E]">
                                            <Icon className="w-8 "/>
                                        </div>
                                        <CardTitle className="text-xl font-semibold text-white">
                                            {card.title}
                                        </CardTitle>
                                    </CardHeader>
                                    {/*<CardContent className="pt-2">*/}
                                    {/*    <div className="w-full h-2 bg-blue-900/30 rounded-full mb-3"></div>*/}
                                    {/*</CardContent>*/}
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
