"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Phone,
  Mail,
  MapPin,
  MoreHorizontal,
  MessageSquare,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";

// Mock data for the user - in real app this would come from API/store
const mockUserData = {
  name: "محمد علي",
  email: "staffuser@vd-2030.com",
  phone: "0585624785",
  address: "جدة",
  joinDate: "24/01/2023",
};

// Mock data for applications - in real app this would come from API
const mockApplications = [
  {
    id: 1,
    number: "24324586324",
    submissionDate: "24/12/2024",
    product: "iPhone 12 Pro",
    status: "approved",
  },
  {
    id: 2,
    number: "24324586324",
    submissionDate: "24/12/2024",
    product: "iPhone 12 Pro",
    status: "pending",
  },
  {
    id: 3,
    number: "24324586324",
    submissionDate: "24/12/2024",
    product: "iPhone 12 Pro",
    status: "approved",
  },
];

// Status badges mapping
const getStatusBadge = (status: string) => {
  const statusMap = {
    approved: {
      variant: "default" as const,
      icon: <CheckCircle className="w-3 h-3" />,
      label: "معتمد",
    },
    pending: {
      variant: "secondary" as const,
      icon: <Clock className="w-3 h-3" />,
      label: "قيد المراجعة",
    },
    rejected: {
      variant: "destructive" as const,
      icon: <AlertTriangle className="w-3 h-3" />,
      label: "مرفوض",
    },
  };

  return statusMap[status as keyof typeof statusMap] || statusMap.pending;
};

// Progress Status Circle Component
const ProgressStatusCircle = ({
  status,
  color,
  label,
}: {
  status: string;
  color: string;
  label: string;
}) => (
  <div className="flex flex-col items-center gap-2">
    <div className={`w-4 h-4 rounded-full ${color}`} aria-label={status} />
    <span className="text-sm text-muted-foreground">{label}</span>
  </div>
);

const Statuses = () => (
  <Card className="bg-sidebar">
    <CardContent className="p-6">
      <div className="space-y-6">
        {/* Progress Circles */}
        <div className="flex justify-between items-center">
          <ProgressStatusCircle
            status="received"
            color="bg-pink-500"
            label="استلام"
          />
          <div className="flex-1 h-0.5 bg-muted mx-2" />

          <ProgressStatusCircle
            status="processing"
            color="bg-green-500"
            label="تنفيذ"
          />
          <div className="flex-1 h-0.5 bg-muted mx-2" />

          <ProgressStatusCircle
            status="financial"
            color="bg-yellow-500"
            label="مالية"
          />
          <div className="flex-1 h-0.5 bg-muted mx-2" />

          <ProgressStatusCircle
            status="closed"
            color="bg-gray-400"
            label="اغلاق"
          />
        </div>

        {/* Progress Bar Placeholder */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>التقدم الحالي</span>
            <span>{70}%</span>
          </div>
          <Progress value={70} className="h-2" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const BasicInfoCard = () => (
  <Card className="bg-sidebar">
    <CardHeader>
      <CardTitle className="text-lg">البيانات الأساسية</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="font-medium w-20">الاسم</span>
          <span className="text-muted-foreground">{mockUserData.name}</span>
        </div>

        <Separator />

        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium w-20">البريد الإلكتروني</span>
          <span className="text-muted-foreground text-sm">
            {mockUserData.email}
          </span>
        </div>

        <Separator />

        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium w-20">رقم الجوال</span>
          <span className="text-muted-foreground">{mockUserData.phone}</span>
        </div>

        <Separator />

        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium w-20">العنوان</span>
          <span className="text-muted-foreground">{mockUserData.address}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const AddressesCard = () => (
  <Card className="bg-sidebar">
    <CardHeader>
      <CardTitle className="text-lg">العناوين</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Address Items */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
          <div className="w-2 h-2 bg-pink-500 rounded-full" />
          <div className="flex-1">
            <div className="font-medium">حي السامر - حدة</div>
            <div className="text-sm text-muted-foreground">العنوان الأساسي</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
          <div className="w-2 h-2 bg-pink-500 rounded-full" />
          <div className="flex-1">
            <div className="font-medium">حي السامر - حدة</div>
            <div className="text-sm text-muted-foreground">عنوان العمل</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
          <div className="w-2 h-2 bg-pink-500 rounded-full" />
          <div className="flex-1">
            <div className="font-medium">حي الروضة - حدة</div>
            <div className="text-sm text-muted-foreground">عنوان المنزل</div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ComplaintsCard = () => (
  <Card className="bg-sidebar">
    <CardHeader className="flex flex-row items-center justify-between space-y-0">
      <CardTitle className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        الشكاوي والاقتراحات
      </CardTitle>
      <Badge variant="destructive" className="bg-red-500">
        1
      </Badge>
    </CardHeader>
    <CardContent>
      <div className="p-4 bg-background/50 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="w-4 h-4 text-pink-500" />
          <span>هذا النص مثال على نص يمكن استخدامه</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Orders = () => (
  <Card className="bg-sidebar">
    <CardHeader className="flex flex-row items-center justify-between space-y-0">
      <CardTitle className="flex items-center gap-2">
        <FileText className="w-5 h-5" />
        الطلبات
      </CardTitle>
      <Badge variant="secondary" className="bg-orange-500 text-white">
        10
      </Badge>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Application Items */}
      {mockApplications.map((application) => {
        const statusConfig = getStatusBadge(application.status);

        return (
          <div
            key={application.id}
            className="flex items-center justify-between p-4 bg-background/50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Badge
                variant={statusConfig.variant}
                className="flex items-center gap-1"
              >
                {statusConfig.icon}
              </Badge>

              <div className="space-y-1">
                <div className="font-medium">{application.number}</div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>تاريخ الاستلام: {application.submissionDate}</span>
                  <span>المنتج: {application.product}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </CardContent>
  </Card>
);

export default function StoresView() {
  // State for progress bar placeholder

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <BasicInfoCard />
          <AddressesCard />
          <Statuses />
          <ComplaintsCard />
          <Orders />
        </div>
      </div>
    </div>
  );
}
