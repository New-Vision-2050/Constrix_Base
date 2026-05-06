"use client";

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useIndicatorsService } from '@/services/api/indicators/indicatorsService';
import { useTranslations } from "next-intl";

interface NationalityData {
    name: string;
    value: number;
}

export function NationalityChart() {
  const t = useTranslations("WorkPanel");
  const [nationalityData, setNationalityData] = useState<NationalityData[]>([
    { name: t("saudiNationality"), value: 45 },
    { name: t("nonSaudiNationality"), value: 110 }
  ]);
  const { getAllChartsData } = useIndicatorsService();

  useEffect(() => {
    const fetchNationalityData = async () => {
      try {
        const apiResponse = await getAllChartsData();
        
        if (apiResponse && apiResponse.code === "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT" && 
            apiResponse.payload && apiResponse.payload.nationality) {
          const formattedNationalityData = apiResponse.payload.nationality.data.map((item: any) => ({
            name: item.label,
            value: item.count
          }));
          setNationalityData(formattedNationalityData);
        }
      } catch (error) {
        console.error('Error fetching nationality data:', error);
      }
    };

    fetchNationalityData();
  }, [getAllChartsData]);

  return (
    <div className="w-full h-64  rounded-lg p-4 flex flex-col">
      <h3 className="text-white text-lg font-semibold mb-2 text-right">{t("nationality")}</h3>
      <div className="flex-1 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={nationalityData}>
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
