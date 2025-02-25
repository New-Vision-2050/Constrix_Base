"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MobileIcon from "@/public/icons/MobileIcon";
import PassIcon from "@/public/icons/PassIcon";
import BarCodeIcon from "@/public/icons/BarCodeIcon";
import NetworkIcon from "@/public/icons/NetworkIcon";
import { ChevronDown } from "lucide-react";
import { memo } from "react";

const AnotherCheckingWay = memo(() => {
  const menuItems = [
    { id: 0, label: "رقم الجوال", icon: <MobileIcon />, func: () => null },
    { id: 1, label: "كلمة المرور", icon: <PassIcon />, func: () => null },
    { id: 2, label: "الباركود", icon: <BarCodeIcon />, func: () => null },
    {
      id: 3,
      label: "الشبكة المحلية",
      icon: <NetworkIcon />,
      func: () => null,
    },
  ];

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger className="underline group flex items-end gap-1">
        او اختر طريقة تحقق اخرى
        <ChevronDown className="h-4 w-4 transition group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>التحقق عن طريق</DropdownMenuLabel>
        {menuItems.map((item) => (
          <DropdownMenuItem key={item.id} className="gap-4" onClick={item.func}>
            {item.icon}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

AnotherCheckingWay.displayName = "AnotherCheckingWay";

export default AnotherCheckingWay;
