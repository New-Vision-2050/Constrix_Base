"use client";

import * as React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTranslations } from "next-intl";

export function Examination() {
    const t = useTranslations("WorkPanel");
    const data = [
      { name: t("passed"), value: 85, color: '#10B981' },
      { name: t("failed"), value: 15, color: '#EF4444' }
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
                <h3 className="text-lg font-semibold">{t("examination")}</h3>
            </div>
        </div>
    );
}
