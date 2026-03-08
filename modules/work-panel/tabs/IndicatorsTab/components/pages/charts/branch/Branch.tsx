"use client";

import * as React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'فرع 1', value: 45, color: '#3B82F6' },
  { name: 'فرع 2', value: 30, color: '#10B981' },
  { name: 'فرع 3', value: 25, color: '#F59E0B' }
];

export function Branch() {
    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value) => value}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-2">
                <h3 className="text-lg font-semibold">الفرع</h3>
            </div>
        </div>
    );
}
