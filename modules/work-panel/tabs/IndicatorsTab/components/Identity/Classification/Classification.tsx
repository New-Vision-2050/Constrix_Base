"use client";

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useIndicatorsService } from '@/services/api/indicators/indicatorsService';

interface NationalityData {
    name: string;
    value: number;
}

export function NationalityChart() {
  const [nationalityData, setNationalityData] = useState<NationalityData[]>([
    { name: "السعودية", value: 45 },
    { name: "الغير سعودية", value: 110 }
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
    <div className="w-full h-64 bg-purple-700 rounded-lg p-4 flex flex-col justify-between">
      <h3 className="text-white text-lg font-semibold mb-4 text-right">الجنسية</h3>
      <div className="flex-grow flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={nationalityData}>
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
