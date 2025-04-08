"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import PlanCard from "../plan-card";

type EmployeeCardProps = {
  currentUsers: number;
  maxUsers: number;
  price: number;
  daysLeft: number;
  storageLimit: string;
};

const EmployeeCard = ({
  currentUsers,
  maxUsers,
  price,
  daysLeft,
  storageLimit,
}: EmployeeCardProps) => {
  const usagePercent = Math.round((currentUsers / maxUsers) * 100);

  return (
    <div className="flex gap-6 rounded-lg p-4">
      {/* Right Box */}

      <PlanCard
        currentUsers={6}
        maxUsers={10}
        price={99}
        daysLeft={4}
        storageLimit="10 جيجابايت"
      />

      {/* Left Box */}
      <div className="flex flex-col grow w-full bg-sidebar rounded-lg p-5">
        <div className="flex gap-4">
        الموظفين    <AlertCircle className="text-yellow-500 mb-2" /> 
        </div>
        <div className="grow flex items-center justify-center">
          <p className="text-muted-foreground text-sm">لا يوجد بيانات</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
