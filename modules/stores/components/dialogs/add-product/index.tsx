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
import { Input } from "@/components/ui/input";
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
      <DialogContent
        className="max-w-7xl w-full bg-[#1A1625] border-0 p-0"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader className="p-6 border-b border-[#3c345a]">
          <DialogTitle className="text-center text-xl font-semibold text-white">
            إضافة منتج عادي
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="w-5 h-5 text-white" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Section */}
            <div className="col-span-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-400 text-sm mb-2 block">
                    اسم المنتج
                  </Label>
                  <Input
                    className="bg-[#2a233c] border-[#3c345a] text-white placeholder-gray-500 rounded-lg"
                    placeholder="هاتف ايفون"
                  />
                </div>
                <div>
                  <Label className="text-gray-400 text-sm mb-2 block">
                    سعر المنتج
                  </Label>
                  <Input
                    className="bg-[#2a233c] border-[#3c345a] text-white placeholder-gray-500 rounded-lg"
                    placeholder="1600"
                    type="number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-400 text-sm mb-2 block">
                    رمز المنتج
                  </Label>
                  <Input
                    className="bg-[#2a233c] border-[#3c345a] text-white placeholder-gray-500 rounded-lg"
                    placeholder="16AAFF206"
                  />
                </div>
                <div>
                  <Label className="text-gray-400 text-sm mb-2 block">
                    وصف المنتج
                  </Label>
                  <Input
                    className="bg-[#2a233c] border-[#3c345a] text-white placeholder-gray-500 rounded-lg"
                    placeholder="وصف هذا المنتج الذي قد يكون سطرا أو يتجاوز ذلك بـ..."
                  />
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
                    options={[
                      { label: "مخزن جدة", value: "jeddah_warehouse" }
                    ]}
                    valueProps={{
                      placeholder: "اختر المخزن"
                    }}
                  />
                </div>
                <div>
                  <Label className="text-gray-400 text-sm mb-2 block">
                    الكمية
                  </Label>
                  <Input
                    className="bg-[#2a233c] border-[#3c345a] text-white placeholder-gray-500 rounded-lg"
                    placeholder="8000"
                    type="number"
                  />
                </div>
                <div>
                  <Label className="text-gray-400 text-sm mb-2 block">
                    التصنيف الرئيسي
                  </Label>
                  <SimpleSelect
                    value={selectedMainCategory}
                    onValueChange={setSelectedMainCategory}
                    options={[
                      { label: "الكترونيات", value: "electronics" }
                    ]}
                    valueProps={{
                      placeholder: "اختر التصنيف الرئيسي"
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
                    options={[
                      { label: "أجهزة", value: "devices" }
                    ]}
                    valueProps={{
                      placeholder: "اختر التصنيف الفرعي"
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-8 space-x-reverse">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Switch id="tax-switch" />
                  <Label htmlFor="tax-switch" className="text-white">
                    الضريبة
                  </Label>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Switch id="shipping-switch" />
                  <Label htmlFor="shipping-switch" className="text-white">
                    تتطلب شحن
                  </Label>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Switch id="unlimited-qty-switch" />
                  <Label htmlFor="unlimited-qty-switch" className="text-white">
                    كمية غير محدودة
                  </Label>
                </div>
              </div>
            </div>

            {/* Right Section - Image Upload */}
            <div className="col-span-4">
              <div className="bg-[#2a233c] border border-[#3c345a] rounded-lg p-6 text-center h-full flex flex-col justify-center items-center">
                <h3 className="text-white text-lg font-medium mb-4">
                  صورة المنتج
                </h3>
                <div className="w-32 h-32 bg-[#1A1625] rounded-lg flex flex-col items-center justify-center mb-4">
                  <Upload className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  اقصى حجم للصورة: 2160 × 2160 - 3MB
                  <br />
                  .jpg, .png, .webp
                </p>
                <Button variant="outline">ارفق</Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Left Section - VAT Settings */}
            <div className="col-span-8 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-xl font-medium">
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
                          <td className="p-4 text-white">مصر</td>
                          <td className="p-4 text-white">265-365-254</td>
                          <td className="p-4 text-white">14%</td>
                          <td className="p-4">
                            <Switch defaultChecked />
                          </td>
                          <td className="p-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-white"
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

            {/* Right Section - Toggles */}
            <div className="col-span-4 space-y-6">
              <div className="bg-[#2a233c] border border-[#3c345a] rounded-lg p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <Label className="text-white">المنتج معفى من الضريبة</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-white">
                    السعر شامل ضريبة القيمة المضافة
                  </Label>
                  <Switch />
                </div>
              </div>
              <div className="bg-[#2a233c] border border-[#3c345a] rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-white">عرض المنتج على المتجر</Label>
                  <Switch defaultChecked />
                </div>
                <p className="text-gray-400 text-sm">
                  في حالة عدم اختيارك عرض المنتج على المتجر سيتم حفظ المنتج في
                  المنتجات ولن يتم اظهاره للمستخدم على المتجر الخاص بك
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <Button
              variant="outline"
              className="bg-[#2a233c] border-[#3c345a] text-gray-400 hover:bg-[#3c345a] hover:text-white rounded-lg py-6"
            >
              تحسين محركات البحث
            </Button>
            <Button
              variant="outline"
              className="bg-[#2a233c] border-[#3c345a] text-gray-400 hover:bg-[#3c345a] hover:text-white rounded-lg py-6"
            >
              تفاصيل اضافية للمنتج
            </Button>
            <Button
              variant="outline"
              className="bg-[#2a233c] border-[#3c345a] text-gray-400 hover:bg-[#3c345a] hover:text-white rounded-lg py-6"
            >
              حقول مخصصة
            </Button>
          </div>
        </div>

        <div className="flex gap-4 p-6 border-t border-[#3c345a]">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-[#E93A88] hover:bg-[#d0347a] text-white rounded-lg py-6"
          >
            {isSubmitting ? "جاري الحفظ..." : "حفظ"}
          </Button>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 bg-transparent border-[#3c345a] text-gray-400 hover:bg-[#2a233c] hover:text-white rounded-lg py-6"
          >
            الغاء
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
