"use client";

import * as React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTranslations } from "next-intl";

export function Holidays() {
    const t = useTranslations("WorkPanel");
    const data = [
      { name: t("sickLeaves"), value: 20, color: '#EF4444' },
      { name: t("annualLeaves"), value: 60, color: '#3B82F6' },
      { name: t("specialLeaves"), value: 20, color: '#10B981' }
    ];
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
                <h3 className="text-lg font-semibold">{t("totalHolidays")}</h3>
            </div>
        </div>
    );
}
