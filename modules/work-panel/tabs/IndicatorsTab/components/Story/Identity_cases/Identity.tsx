"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#FFBB28', '#0088FE', '#8884d8'];

export function Identity() {
  const data = [
    { value: 1, name: 'منتهي', percentage: '1%' },
    { value: 145, name: 'جاري', percentage: '84%' },
    { value: 26, name: 'لا يوجد', percentage: '15%' }
  ];

  return (
    <div className="w-full h-64 bg-blue-700 rounded-lg p-4 flex flex-col justify-between">
      <h3 className="text-white text-lg font-semibold mb-4 text-right">حالات الهوية</h3>
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
