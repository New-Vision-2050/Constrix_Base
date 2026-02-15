"use client";

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useIndicatorsService } from '@/services/api/indicators/indicatorsService';

const COLORS = ['#FFBB28', '#0088FE', '#8884d8'];

export function Shipping() {
  const [data, setData] = useState<any[]>([
    { value: 1, name: 'منتهي', percentage: '1%' },
    { value: 145, name: 'جاري', percentage: '84%' },
    { value: 26, name: 'لا يوجد', percentage: '15%' }
  ]);
  const { getAllChartsData } = useIndicatorsService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllChartsData();
        
        if (response && response.code === "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT" && 
            response.payload && response.payload.visa_status) {
          const visaStatusData = response.payload.visa_status.data.map((item: any) => ({
            value: item.count,
            name: item.label,
            percentage: `${item.percentage}%`
          }));
          setData(visaStatusData);
        }
      } catch (error) {
        console.error('Error fetching shipping data:', error);
      }
    };

    fetchData();
  }, [getAllChartsData]);

  return (
    <div className="w-full h-64 bg-yellow-700 rounded-lg p-4 flex flex-col justify-between">
      <h3 className="text-white text-lg font-semibold mb-4 text-right">حالات الشحن</h3>
      <div className="flex-grow flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name, props) => [`${props.payload.percentage}`, name]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-around mt-4">
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
            <span className="text-white text-sm">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
