"use client";

import React, { useState } from "react";
import { Box, Typography, Button, Menu, MenuItem, ListItemIcon } from "@mui/material";
import ChevronDownIcon from "@/public/icons/chevron-down-icon";

interface Service {
  id: number;
  name: string;
}

interface ServicesDropdownProps {
  services: Service[];
  selectedServices: number[];
  onServiceToggle: (serviceId: number) => void;
  label?: string;
  className?: string;
}

const ServicesDropdown: React.FC<ServicesDropdownProps> = ({
  services,
  selectedServices,
  onServiceToggle,
  label = "الخدمات",
  className = ""
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Debug logs
  console.log("ServicesDropdown - services:", services);
  console.log("ServicesDropdown - selectedServices:", selectedServices);
  console.log("ServicesDropdown - services type:", typeof services);
  console.log("ServicesDropdown - isArray:", Array.isArray(services));

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleServiceClick = (serviceId: number) => {
    onServiceToggle(serviceId);
    // Don't close the menu to allow multiple selections
  };

  return (
    <Box className={className}>
      <Button
        variant="outlined"
        onClick={handleClick}
        endIcon={
          <ChevronDownIcon 
            additionalClass={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        }
        sx={{
          borderColor: '#e0e0e0',
          color: '#333',
          textTransform: 'none',
          px: 2,
          py: 1,
          justifyContent: 'space-between',
          minWidth: '150px',
          '&:hover': {
            borderColor: '#1976d2',
            backgroundColor: 'rgba(25, 118, 210, 0.04)'
          }
        }}
      >
        <Typography variant="body2">
          {label}
        </Typography>
      </Button>

      {/* Display selected services as a list */}
      {selectedServices.length > 0 && Array.isArray(services) && (
        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {selectedServices.map((serviceId) => {
            const service = services.find(s => s.id === serviceId);
            return service ? (
              <Box
                key={service.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 0.5,
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  borderRadius: 1,
                  border: '1px solid rgba(25, 118, 210, 0.2)'
                }}
              >
                <Box
                  sx={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#1976d2',
                    flexShrink: 0
                  }}
                />
                <Typography variant="body2" color="#1976d2" fontWeight="medium">
                  {service.name}
                </Typography>
              </Box>
            ) : null;
          })}
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            maxHeight: 300,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0',
            borderRadius: '8px'
          }
        }}
        MenuListProps={{
          sx: {
            py: 1
          }
        }}
      >
        {Array.isArray(services) && services.length > 0 ? (
          services.map((service) => (
            <MenuItem
              key={service.id}
              onClick={() => handleServiceClick(service.id)}
              sx={{
                px: 2,
                py: 1,
                fontSize: '0.875rem',
                backgroundColor: selectedServices.includes(service.id) 
                  ? 'rgba(25, 118, 210, 0.08)' 
                  : 'transparent',
                color: selectedServices.includes(service.id) 
                  ? '#1976d2' 
                  : 'inherit',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)'
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  color: '#1976d2'
                }
              }}
              selected={selectedServices.includes(service.id)}
            >
              <Typography variant="body2">
                {service.name}
              </Typography>
              {selectedServices.includes(service.id) && (
                <ListItemIcon sx={{ minWidth: '24px', ml: 1 }}>
                  <Box
                    sx={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#1976d2'
                    }}
                  />
                </ListItemIcon>
              )}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              {!services ? "جاري التحميل..." : 
               !Array.isArray(services) ? "بيانات غير صالحة" : 
               services.length === 0 ? "لا توجد خدمات متاحة" : 
               "خطأ غير معروف"}
            </Typography>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default ServicesDropdown;
