"use client";

import * as React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTranslations } from "next-intl";

export function Branch() {
    const t = useTranslations("WorkPanel");
    const data = [
      { name: t("branchOne"), value: 45, color: '#3B82F6' },
      { name: t("branchTwo"), value: 30, color: '#10B981' },
      { name: t("branchThree"), value: 25, color: '#F59E0B' }
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
                <h3 className="text-lg font-semibold">{t("branch")}</h3>
            </div>
        </div>
    );
}
