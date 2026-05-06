"use client";

import * as React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useIndicatorsService } from '@/services/api/indicators/indicatorsService';
import { useTranslations } from "next-intl";

interface ContractExpirationData {
    name: string;
    value: number;
}

export function CompanyChart() {
    const t = useTranslations("WorkPanel");
    const [contractData, setContractData] = React.useState<ContractExpirationData[]>([
        { name: t("decemberYear2025"), value: 1 },
        { name: t("februaryYear2027"), value: 1 },
        { name: t("noContract"), value: 11 }
    ]);
    const { getAllChartsData } = useIndicatorsService();

    React.useEffect(() => {
        const fetchContractData = async () => {
            try {
                const apiResponse = await getAllChartsData();
                
                if (apiResponse && apiResponse.code === "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT" && 
                    apiResponse.payload && apiResponse.payload.contract_expiration_by_month) {
                    const formattedContractData = apiResponse.payload.contract_expiration_by_month.data.map((item: any) => ({
                        name: item.label,
                        value: item.count
                    }));
                    setContractData(formattedContractData);
                }
            } catch (error) {
                console.error('Error fetching contract expiration data:', error);
            }
        };

        fetchContractData();
    }, [getAllChartsData]);

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={contractData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
            <div className="text-center mt-1">
                <h3 className="text-lg font-semibold">{t("contractExpiryMonthly")}</h3>
            </div>
        </div>
    );
}
