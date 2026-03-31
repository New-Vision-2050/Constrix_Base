"use client";

import {Paper, Tab, Tabs} from "@mui/material";
import {useState} from "react";
import {useTranslations} from "next-intl";
import StagesView from "./StagesView";

interface SubTab {
    id: number;
    name: string;
    type: string;
}

const MOCK_SUB_TABS: SubTab[] = [
    {id: 2, name: "priceOffers", type: "price_offer"},

    {id: 1, name: "contracts", type: "contract"},
    {id: 3, name: "meetings", type: "meeting"},
];

export default function SubTypeTabs() {
    const t = useTranslations("CRMSettingsModule.proceduresSettings.subTabs");
    const [selectedTab, setSelectedTab] = useState<number>(MOCK_SUB_TABS[0].id);

    const getCurrentTabType = () => {
        const currentTab = MOCK_SUB_TABS.find((tab) => tab.id === selectedTab);
        return currentTab?.type || "client_request";
    };

    return (
        <div className="space-y-4">
            <Paper>
                <Tabs
                    value={selectedTab}
                    onChange={(_, value: number) => setSelectedTab(value)}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {MOCK_SUB_TABS.map((tab) => (
                        <Tab key={tab.id} value={tab.id} label={t(tab.name)}/>
                    ))}
                </Tabs>
            </Paper>
            {selectedTab === 2 && <StagesView currentTabType={getCurrentTabType()}/>}
        </div>
    );
}
