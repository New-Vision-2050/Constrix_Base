"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Trend() {
  const data = [
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
  ];

  return (
    <div className="w-full h-64 bg-indigo-700 rounded-lg p-4 flex flex-col justify-between">
      <h3 className="text-white text-lg font-semibold mb-4 text-right">الاتجاه</h3>
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
