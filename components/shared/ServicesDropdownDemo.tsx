"use client";

import React, { useState } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import ServicesDropdown from "./ServicesDropdown";

interface Service {
  id: number;
  name: string;
}

const ServicesDropdownDemo: React.FC = () => {
  // Mock services data (same as in your main-items-card.tsx)
  const services: Service[] = [
    { id: 1, name: "مرفقات" },
    { id: 2, name: "خطابات" },
    { id: 3, name: "المهمات" },
    { id: 4, name: "النسبة المئوية" },
    { id: 5, name: "معاملات" },
    { id: 6, name: "فريق عمل" },
    { id: 7, name: "الشخص المسؤول" },
  ];

  // State for multiple dropdown instances
  const [selectedServices1, setSelectedServices1] = useState<number[]>([]);
  const [selectedServices2, setSelectedServices2] = useState<number[]>([2, 3]); // Pre-selected
  const [selectedServices3, setSelectedServices3] = useState<number[]>([]);

  console.log("Demo - services:", services);

  const handleServiceToggle = (dropdownId: number, serviceId: number) => {
    const setter = dropdownId === 1 ? setSelectedServices1 : 
                   dropdownId === 2 ? setSelectedServices2 : 
                   setSelectedServices3;
    
    const current = dropdownId === 1 ? selectedServices1 : 
                    dropdownId === 2 ? selectedServices2 : 
                    selectedServices3;

    setter(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const getSelectedServiceNames = (serviceIds: number[]) => {
    return serviceIds
      .map(id => services.find(s => s.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <Box sx={{ p: 3, direction: 'rtl' }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        عرض الخدمات في قائمة منسدلة مع عرض الخدمات المحددة
      </Typography>
      
      <Grid container spacing={3}>
        {/* First Dropdown */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="body2" color="text.secondary" mb={2}>
              القائمة 1
            </Typography>
            <ServicesDropdown
              services={services}
              selectedServices={selectedServices1}
              onServiceToggle={(serviceId) => handleServiceToggle(1, serviceId)}
            />
          </Paper>
        </Grid>

        {/* Second Dropdown */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="body2" color="text.secondary" mb={2}>
              القائمة 2 (محدد مسبقًا)
            </Typography>
            <ServicesDropdown
              services={services}
              selectedServices={selectedServices2}
              onServiceToggle={(serviceId) => handleServiceToggle(2, serviceId)}
            />
          </Paper>
        </Grid>

        {/* Third Dropdown - Highlighted */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 2, 
            border: '2px solid #e91e63',
            backgroundColor: 'rgba(233, 30, 99, 0.02)'
          }}>
            <Typography variant="body2" color="text.secondary" mb={2}>
              القائمة 3 (مميزة)
            </Typography>
            <ServicesDropdown
              services={services}
              selectedServices={selectedServices3}
              onServiceToggle={(serviceId) => handleServiceToggle(3, serviceId)}
              label="اختر الخدمات"
            />
          </Paper>
        </Grid>
      </Grid>

      <Box mt={3} p={2} sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>ملاحظات:</strong>
          <br />• انقر على السهم لفتح/إغلاق القائمة
          <br />• يمكن تحديد خدمات متعددة
          <br />• الخدمات المحددة تظهر كقائمة أسفل الزر
          <br />• كل خدمة محددة تظهر مع نقطة زرقاء وإطار مميز
          <br />• القائمة تبقى مفتوحة لتحديد خدمات متعددة
        </Typography>
      </Box>
    </Box>
  );
};

export default ServicesDropdownDemo;
