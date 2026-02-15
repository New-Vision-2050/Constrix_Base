"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Classification() {
  const data = [
    { name: "السعودية", value: 45 },
    { name: "الغير سعودية", value: 110 }
  ];

  return (
    <div className="w-full h-64 bg-purple-700 rounded-lg p-4 flex flex-col justify-between">
      <h3 className="text-white text-lg font-semibold mb-4 text-right">التصنيف</h3>
      <div className="flex-grow flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
