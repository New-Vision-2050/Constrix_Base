"use client";

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useIndicatorsService } from '@/services/api/indicators/indicatorsService';

interface AgeData {
    name: string;
    value: number;
}

export function AgeDistributionChart() {
    const [ageData, setAgeData] = useState<AgeData[]>([
        { name: 'مايو', value: 8 },
        { name: 'يونيو', value: 12 },
        { name: 'يوليو', value: 15 },
        { name: 'أغسطس', value: 18 },
        { name: 'سبتمبر', value: 22 },
        { name: 'أكتوبر', value: 25 },
        { name: 'نوفمبر', value: 28 },
        { name: 'ديسمبر', value: 30 },
        { name: 'يناير', value: 32 },
        { name: 'فبراير', value: 28 },
        { name: 'مارس', value: 32 }
    ]);
    const { getAllChartsData } = useIndicatorsService();

    useEffect(() => {
        const fetchAgeData = async () => {
            try {
                const apiResponse = await getAllChartsData();
                
                if (apiResponse && apiResponse.code === "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT" && 
                    apiResponse.payload && apiResponse.payload.age) {
                    const formattedAgeData = apiResponse.payload.age.data.map((item: any) => ({
                        name: item.label,
                        value: item.count
                    }));
                    setAgeData(formattedAgeData);
                }
            } catch (error) {
                console.error('Error fetching age distribution data:', error);
            }
        };

        fetchAgeData();
    }, [getAllChartsData]);

  return (
    <div className="w-full h-64 bg-indigo-700 rounded-lg p-4 flex flex-col">
      <h3 className="text-white text-lg font-semibold mb-2 text-right">توزيع العمر</h3>
      <div className="flex-1 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
