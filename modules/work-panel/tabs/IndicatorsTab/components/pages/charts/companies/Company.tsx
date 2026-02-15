"use client";

import * as React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useIndicatorsService } from '@/services/api/indicators/indicatorsService';

interface ContractExpirationData {
    name: string;
    value: number;
}

export function CompanyChart() {
    const [contractData, setContractData] = React.useState<ContractExpirationData[]>([
        { name: 'ديسمبر 2025', value: 1 },
        { name: 'فبراير 2027', value: 1 },
        { name: 'بدون عقد', value: 11 }
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
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
            <div className="text-center mt-1">
                <h3 className="text-lg font-semibold">انتهاء العقود شهرياً</h3>
            </div>
        </div>
    );
}
