import React from "react";

import HomeOutlined from "@mui/icons-material/HomeOutlined";
import BuildOutlined from "@mui/icons-material/BuildOutlined";
import BusinessOutlined from "@mui/icons-material/BusinessOutlined";
import AccountBalanceOutlined from "@mui/icons-material/AccountBalanceOutlined";
import ApartmentOutlined from "@mui/icons-material/ApartmentOutlined";
import EngineeringOutlined from "@mui/icons-material/EngineeringOutlined";
import HandymanOutlined from "@mui/icons-material/HandymanOutlined";
import FoundationOutlined from "@mui/icons-material/FoundationOutlined";
import ArchitectureOutlined from "@mui/icons-material/ArchitectureOutlined";
import ElectricalServicesOutlined from "@mui/icons-material/ElectricalServicesOutlined";
import ConstructionOutlined from "@mui/icons-material/ConstructionOutlined";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import PlumbingOutlined from "@mui/icons-material/PlumbingOutlined";
import AccountTreeOutlined from "@mui/icons-material/AccountTreeOutlined";
import StraightenOutlined from "@mui/icons-material/StraightenOutlined";
import LayersOutlined from "@mui/icons-material/LayersOutlined";
import WarehouseOutlined from "@mui/icons-material/WarehouseOutlined";
import ParkOutlined from "@mui/icons-material/ParkOutlined";
import WaterOutlined from "@mui/icons-material/WaterOutlined";
import LocalFireDepartmentOutlined from "@mui/icons-material/LocalFireDepartmentOutlined";
import SecurityOutlined from "@mui/icons-material/SecurityOutlined";
import PowerOutlined from "@mui/icons-material/PowerOutlined";
import OpacityOutlined from "@mui/icons-material/OpacityOutlined";
import AirOutlined from "@mui/icons-material/AirOutlined";
import HvacOutlined from "@mui/icons-material/HvacOutlined";

export interface AppIcon {
  id: string;
  /** Translation key e.g. "icons.home" */
  name: string;
  component: React.FC<{ size?: number; color?: string }>;
}

export const APP_ICONS: AppIcon[] = [
  {
    id: "home",
    name: "icons.home",
    component: ({ size = 24, color = "inherit" }) => (
      <HomeOutlined sx={{ fontSize: size, color }} />
    ),
  },
  {
    id: "build",
    name: "icons.build",
    component: ({ size = 24, color = "inherit" }) => (
      <BuildOutlined sx={{ fontSize: size, color }} />
    ),
  },
  {
    id: "business",
    name: "icons.business",
    component: ({ size = 24, color = "inherit" }) => (
      <BusinessOutlined sx={{ fontSize: size, color }} />
    ),
  },
  {
    id: "account-balance",
    name: "icons.accountBalance",
    component: ({ size = 24, color = "inherit" }) => (
      <AccountBalanceOutlined sx={{ fontSize: size, color }} />
    ),
  },
  {
    id: "apartment",
    name: "icons.apartment",
    component: ({ size = 24, color = "inherit" }) => (
      <ApartmentOutlined sx={{ fontSize: size, color }} />
    ),
  },
  {
    id: "engineering",
    name: "icons.engineering",
    component: ({ size = 24, color = "inherit" }) => (
      <EngineeringOutlined sx={{ fontSize: size, color }} />
    ),
  },
  {
    id: "handyman",
    name: "icons.handyman",
    component: ({ size = 24, color = "inherit" }) => (
      <HandymanOutlined sx={{ fontSize: size, color }} />
    ),
  },
  {
    id: "foundation",
    name: "icons.foundation",
    component: ({ size = 24, color = "inherit" }) => (
      <FoundationOutlined sx={{ fontSize: size, color }} />
    ),
  },
  {
    id: "architecture",
    name: "icons.architecture",
    component: ({ size = 24, color = "inherit" }) => (
      <ArchitectureOutlined sx={{ fontSize: size, color }} />
    ),
  },
  {
    id: "electrical-services",
    name: "icons.electricalServices",
    component: ({ size = 24, color = "inherit" }) => (
      <ElectricalServicesOutlined sx={{ fontSize: size, color }} />
    ),
  },
  {
    id: "construction",
    name: "icons.construction",
    component: ({ size = 24, color = "inherit" }) => (
      <ConstructionOutlined sx={{ fontSize: size, color }} />
    ),
  },
  {
    id: "local-shipping",
    name: "icons.localShipping",
    component: ({ size = 24, color = "inherit" }) => (
      <LocalShippingOutlined sx={{ fontSize: size, color }} />
    ),
  },
  {
    id: "plumbing",
    name: "icons.plumbing",
    component: ({ size = 24, color = "inherit" }) => (
      <PlumbingOutlined sx={{ fontSize: size, color }} />
    ),
  },
  {
    id: "account-tree",
    name: "icons.accountTree",
    component: ({ size = 24, color = "inherit" }) => (
      <AccountTreeOutlined sx={{ fontSize: size, color }} />
    ),
  },
  {
    id: "straighten",
    name: "icons.straighten",
    component: ({ size = 24, color = "inherit" }) => (
      <StraightenOutlined sx={{ fontSize: size, color }} />
    ),
  },
  {
    id: "layers",
    name: "icons.layers",
    component: ({ size = 24, color = "inherit" }) => (
      <LayersOutlined sx={{ fontSize: size, color }} />
    ),
  },
  {
    id: "warehouse",
    name: "icons.warehouse",
    component: ({ size = 24, color = "inherit" }) => (
      <WarehouseOutlined sx={{ fontSize: size, color }} />
    ),
  },
  {
    id: "park",
    name: "icons.park",
    component: ({ size = 24, color = "inherit" }) => (
      <ParkOutlined sx={{ fontSize: size, color }} />
    ),
  },
  {
    id: "water",
    name: "icons.water",
    component: ({ size = 24, color = "inherit" }) => (
      <WaterOutlined sx={{ fontSize: size, color }} />
    ),
  },
  {
    id: "fire-department",
    name: "icons.fireDepartment",
    component: ({ size = 24, color = "inherit" }) => (
      <LocalFireDepartmentOutlined sx={{ fontSize: size, color }} />
    ),
  },
  {
    id: "security",
    name: "icons.security",
    component: ({ size = 24, color = "inherit" }) => (
      <SecurityOutlined sx={{ fontSize: size, color }} />
    ),
  },
  {
    id: "power",
    name: "icons.power",
    component: ({ size = 24, color = "inherit" }) => (
      <PowerOutlined sx={{ fontSize: size, color }} />
    ),
  },
  {
    id: "opacity",
    name: "icons.opacity",
    component: ({ size = 24, color = "inherit" }) => (
      <OpacityOutlined sx={{ fontSize: size, color }} />
    ),
  },
  {
    id: "air",
    name: "icons.air",
    component: ({ size = 24, color = "inherit" }) => (
      <AirOutlined sx={{ fontSize: size, color }} />
    ),
  },
  {
    id: "hvac",
    name: "icons.hvac",
    component: ({ size = 24, color = "inherit" }) => (
      <HvacOutlined sx={{ fontSize: size, color }} />
    ),
  },
];
