"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { Upload, X, Plus, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SimpleSelect from "@/components/headless/select";
import { Input } from "@/modules/table/components/ui/input";
import { Card } from "@/components/ui/card";

interface AddProductDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddProductDialog({
  open,
  onClose,
}: AddProductDialogProps) {
  const isRtl = useIsRtl();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Implement submit logic
      console.log("Submit product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl w-full" dir={isRtl ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-foreground">
            إضافة منتج عادي
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="w-5 h-5 text-foreground" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Start Section */}
            <div className="col-span-4">
              <Card className="bg-sidebar p-6 text-center h-full flex flex-col justify-center items-center">
                <h3 className="text-foreground text-lg font-medium mb-4">
                  صورة المنتج
                </h3>
                <div className="w-32 h-32 bg-gray-500 rounded-lg flex flex-col items-center justify-center mb-4">
                  <Upload className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  اقصى حجم للصورة: 2160 × 2160 - 3MB
                  <br />
                  .jpg, .png, .webp
                </p>
                <Button variant="outline">ارفق</Button>
              </Card>
            </div>
            {/* End Section - Image Upload */}
            <div className="col-span-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-400 text-sm mb-2 block">
                    اسم المنتج
                  </Label>
                  <Input placeholder="هاتف ايفون" />
                </div>
                <div>
                  <Label className="text-gray-400 text-sm mb-2 block">
                    سعر المنتج
                  </Label>
                  <Input placeholder="1600" type="number" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-400 text-sm mb-2 block">
                    رمز المنتج
                  </Label>
                  <Input placeholder="16AAFF206" />
                </div>
                <div>
                  <Label className="text-gray-400 text-sm mb-2 block">
                    وصف المنتج
                  </Label>
                  <Input placeholder="وصف هذا المنتج الذي قد يكون سطرا أو يتجاوز ذلك بـ..." />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-6">
                <div>
                  <Label className="text-gray-400 text-sm mb-2 block">
                    المخزن
                  </Label>
                  <SimpleSelect
                    value={selectedStore}
                    onValueChange={setSelectedStore}
                    options={[{ label: "مخزن جدة", value: "jeddah_warehouse" }]}
                    valueProps={{
                      placeholder: "اختر المخزن",
                    }}
                  />
                </div>
                <div>
                  <Label className="text-gray-400 text-sm mb-2 block">
                    الكمية
                  </Label>
                  <Input placeholder="8000" type="number" />
                </div>
                <div>
                  <Label className="text-gray-400 text-sm mb-2 block">
                    التصنيف الرئيسي
                  </Label>
                  <SimpleSelect
                    value={selectedMainCategory}
                    onValueChange={setSelectedMainCategory}
                    options={[{ label: "الكترونيات", value: "electronics" }]}
                    valueProps={{
                      placeholder: "اختر التصنيف الرئيسي",
                    }}
                  />
                </div>
                <div>
                  <Label className="text-gray-400 text-sm mb-2 block">
                    التصنيف الفرعي
                  </Label>
                  <SimpleSelect
                    value={selectedSubCategory}
                    onValueChange={setSelectedSubCategory}
                    options={[{ label: "أجهزة", value: "devices" }]}
                    valueProps={{
                      placeholder: "اختر التصنيف الفرعي",
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-8 space-x-reverse">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Switch id="tax-switch" />
                  <Label htmlFor="tax-switch" className="text-foreground">
                    الضريبة
                  </Label>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Switch id="shipping-switch" />
                  <Label htmlFor="shipping-switch" className="text-foreground">
                    تتطلب شحن
                  </Label>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Switch id="unlimited-qty-switch" />
                  <Label
                    htmlFor="unlimited-qty-switch"
                    className="text-foreground"
                  >
                    كمية غير محدودة
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Start Section - VAT Settings */}
            <div className="col-span-4 space-y-6">
              <Card className=" bg-sidebar p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">
                    المنتج معفى من الضريبة
                  </Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">
                    السعر شامل ضريبة القيمة المضافة
                  </Label>
                  <Switch />
                </div>
              </Card>
              <Card className=" bg-sidebar p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">
                    عرض المنتج على المتجر
                  </Label>
                  <Switch defaultChecked />
                </div>
                <p className="text-gray-400 text-sm">
                  في حالة عدم اختيارك عرض المنتج على المتجر سيتم حفظ المنتج في
                  المنتجات ولن يتم اظهاره للمستخدم على المتجر الخاص بك
                </p>
              </Card>
            </div>
            {/* End Section - Toggles */}
            <div className="col-span-8 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-foreground text-xl font-medium">
                    إعدادات القيمة المضافة
                  </h3>
                  <Button>
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b ">
                        <th className="text-right p-4 text-gray-400 font-medium">
                          الدولة
                        </th>
                        <th className="text-right p-4 text-gray-400 font-medium">
                          الرقم الضريبي
                        </th>
                        <th className="text-right p-4 text-gray-400 font-medium">
                          نسبة الضريبة
                        </th>
                        <th className="text-right p-4 text-gray-400 font-medium">
                          تفعيل
                        </th>
                        <th className="text-right p-4 text-gray-400 font-medium">
                          إجراء
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2].map((item) => (
                        <tr key={item} className="border-b">
                          <td className="p-4 text-foreground">مصر</td>
                          <td className="p-4 text-foreground">265-365-254</td>
                          <td className="p-4 text-foreground">14%</td>
                          <td className="p-4">
                            <Switch defaultChecked />
                          </td>
                          <td className="p-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-foreground"
                                >
                                  <span className="sr-only">Open menu</span>
                                  <MoreVertical className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>عرض</DropdownMenuItem>
                                <DropdownMenuItem>تعديل</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500">
                                  حذف
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <Button variant="outline">تحسين محركات البحث</Button>
            <Button variant="outline">تفاصيل اضافية للمنتج</Button>
            <Button variant="outline">حقول مخصصة</Button>
          </div>
        </div>

        <div className="flex gap-4 p-6 border-t border-[#3c345a]">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 "
          >
            {isSubmitting ? "جاري الحفظ..." : "حفظ"}
          </Button>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 "
          >
            الغاء
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
