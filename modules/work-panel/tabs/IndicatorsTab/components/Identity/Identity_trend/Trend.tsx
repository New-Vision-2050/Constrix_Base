"use client";

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useIndicatorsService } from '@/services/api/indicators/indicatorsService';
import { useTranslations } from "next-intl";

interface AgeData {
    name: string;
    value: number;
}

export function AgeDistributionChart() {
    const t = useTranslations("WorkPanel");
    const [ageData, setAgeData] = useState<AgeData[]>([
        { name: t("may"), value: 8 },
        { name: t("june"), value: 12 },
        { name: t("july"), value: 15 },
        { name: t("august"), value: 18 },
        { name: t("september"), value: 22 },
        { name: t("october"), value: 25 },
        { name: t("november"), value: 28 },
        { name: t("december"), value: 30 },
        { name: t("january"), value: 32 },
        { name: t("february"), value: 28 },
        { name: t("march"), value: 32 }
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
    <div className="w-full h-64  rounded-lg p-4 flex flex-col">
      <h3 className="text-white text-lg font-semibold mb-2 text-right">{t("ageDistribution")}</h3>
      <div className="flex-1 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ageData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
              <Bar
                  dataKey="value"
                  fill="#F9A825"
                  activeBar={{ fill: '#FFD54F' }}
                  shape={{fill: '#FFD54F'}}
              />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
