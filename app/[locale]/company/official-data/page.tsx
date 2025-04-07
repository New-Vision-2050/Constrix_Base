"use client";

import React from "react";
import { SheetFormBuilder, FormConfig } from "@/modules/form-builder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UserIcon, BuildingIcon, MapPinIcon, FileTextIcon } from "lucide-react";

// Company official data form configuration
const companyFormConfig: FormConfig = {
  title: "البيانات الرسمية للشركة",
  sections: [
    {
      title: "البيانات الرسمية",
      fields: [
        {
          type: "text",
          name: "companyName",
          label: "اسم الشركة",
          placeholder: "نيو فيجن",
          required: true,
          validation: [
            {
              type: "required",
              message: "اسم الشركة مطلوب",
            },
          ],
        },
        {
          type: "text",
          name: "companyNameEn",
          label: "اسم الشركة بالانجليزي",
          placeholder: "يجب كتابة الاسم باللغة الانجليزية",
          required: true,
          validation: [
            {
              type: "required",
              message: "اسم الشركة بالانجليزي مطلوب",
            },
          ],
        },
        {
          type: "select",
          name: "branchName",
          label: "اسم الفرع",
          placeholder: "فرع الرياض",
          options: [
            { value: "riyadh", label: "فرع الرياض" },
            { value: "jeddah", label: "فرع جدة" },
            { value: "dammam", label: "فرع الدمام" },
          ],
          required: true,
        },
        {
          type: "select",
          name: "headquartersCountry",
          label: "دولة المركز الرئيسي",
          placeholder: "المملكة العربية السعودية",
          options: [
            { value: "sa", label: "المملكة العربية السعودية" },
            { value: "ae", label: "الإمارات العربية المتحدة" },
            { value: "kw", label: "الكويت" },
            { value: "qa", label: "قطر" },
            { value: "bh", label: "البحرين" },
            { value: "om", label: "عمان" },
          ],
          required: true,
        },
        {
          type: "select",
          name: "companyEntity",
          label: "كيان الشركة",
          placeholder: "هندسي",
          options: [
            { value: "engineering", label: "هندسي" },
            { value: "commercial", label: "تجاري" },
            { value: "industrial", label: "صناعي" },
            { value: "service", label: "خدمي" },
          ],
          required: true,
        },
        {
          type: "select",
          name: "companyField",
          label: "مجال الشركة",
          placeholder: "استشارات هندسية",
          options: [
            { value: "engineering_consulting", label: "استشارات هندسية" },
            { value: "construction", label: "مقاولات" },
            { value: "real_estate", label: "عقارات" },
            { value: "technology", label: "تقنية" },
          ],
          required: true,
        },
        {
          type: "phone",
          name: "phoneNumber",
          label: "رقم الجوال",
          placeholder: "+966 055456200",
          required: true,
          validation: [
            {
              type: "required",
              message: "رقم الجوال مطلوب",
            },
            {
              type: "pattern",
              value: /^\+?[0-9]{10,15}$/,
              message: "يرجى إدخال رقم جوال صحيح",
            },
          ],
        },
        {
          type: "email",
          name: "email",
          label: "البريد الالكتروني",
          placeholder: "admin@vd-2030.com",
          required: true,
          validation: [
            {
              type: "required",
              message: "البريد الالكتروني مطلوب",
            },
            {
              type: "email",
              message: "يرجى إدخال بريد إلكتروني صحيح",
            },
          ],
        },
        {
          type: "select",
          name: "subscription",
          label: "الباقة",
          placeholder: "متميز",
          options: [
            { value: "premium", label: "متميز" },
            { value: "standard", label: "قياسي" },
            { value: "basic", label: "أساسي" },
          ],
          required: true,
        },
      ],
      columns: 2,
    },
    {
      title: "البيانات القانونية",
      fields: [
        {
          type: "text",
          name: "commercialRegistrationNumber",
          label: "رقم السجل التجاري",
          placeholder: "123456789",
          required: true,
          validation: [
            {
              type: "required",
              message: "رقم السجل التجاري مطلوب",
            },
          ],
        },
        {
          type: "date",
          name: "commercialRegistrationExpiry",
          label: "تاريخ انتهاء السجل التجاري",
          required: true,
          validation: [
            {
              type: "required",
              message: "تاريخ انتهاء السجل التجاري مطلوب",
            },
          ],
        },
        {
          type: "text",
          name: "taxNumber",
          label: "الرقم الضريبي",
          placeholder: "123456789012345",
          required: true,
          validation: [
            {
              type: "required",
              message: "الرقم الضريبي مطلوب",
            },
          ],
        },
        {
          type: "image",
          name: "commercialRegistrationDocument",
          label: "مستند السجل التجاري",
          helperText: "يجب أن يكون المستند بصيغة PDF",
          required: true,
          imageConfig: {
            allowedFileTypes: ["application/pdf"],
            maxFileSize: 5 * 1024 * 1024, // 5MB
          },
        },
      ],
      columns: 2,
    },
    {
      title: "العنوان الوطني",
      fields: [
        {
          type: "select",
          name: "city",
          label: "المدينة",
          placeholder: "الرياض",
          options: [
            { value: "riyadh", label: "الرياض" },
            { value: "jeddah", label: "جدة" },
            { value: "dammam", label: "الدمام" },
            { value: "makkah", label: "مكة المكرمة" },
            { value: "madinah", label: "المدينة المنورة" },
          ],
          required: true,
        },
        {
          type: "select",
          name: "district",
          label: "الحي",
          placeholder: "النرجس",
          options: [
            { value: "narjis", label: "النرجس" },
            { value: "yasmin", label: "الياسمين" },
            { value: "rawdah", label: "الروضة" },
            { value: "olaya", label: "العليا" },
            { value: "sulimaniyah", label: "السليمانية" },
          ],
          required: true,
        },
        {
          type: "text",
          name: "street",
          label: "الشارع",
          placeholder: "شارع الأمير سعود بن محمد",
          required: true,
        },
        {
          type: "text",
          name: "buildingNumber",
          label: "رقم المبنى",
          placeholder: "8244",
          required: true,
        },
        {
          type: "text",
          name: "postalCode",
          label: "الرمز البريدي",
          placeholder: "12345",
          required: true,
          validation: [
            {
              type: "pattern",
              value: /^[0-9]{5}$/,
              message: "يرجى إدخال رمز بريدي صحيح مكون من 5 أرقام",
            },
          ],
        },
        {
          type: "text",
          name: "additionalNumber",
          label: "الرقم الإضافي",
          placeholder: "1234",
        },
      ],
      columns: 2,
    },
    {
      title: "بيانات الدعم",
      fields: [
        {
          type: "text",
          name: "supportName",
          label: "اسم مسؤول الدعم",
          placeholder: "محمد خالد حسن",
          required: true,
        },
        {
          type: "phone",
          name: "supportPhone",
          label: "رقم جوال مسؤول الدعم",
          placeholder: "+966 562145222",
          required: true,
        },
        {
          type: "email",
          name: "supportEmail",
          label: "البريد الإلكتروني لمسؤول الدعم",
          placeholder: "hassan@gmail.com",
          required: true,
        },
        {
          type: "select",
          name: "supportNationality",
          label: "جنسية مسؤول الدعم",
          placeholder: "مصري",
          options: [
            { value: "egyptian", label: "مصري" },
            { value: "saudi", label: "سعودي" },
            { value: "jordanian", label: "أردني" },
            { value: "syrian", label: "سوري" },
            { value: "yemeni", label: "يمني" },
          ],
          required: true,
        },
      ],
      columns: 2,
    },
    {
      title: "المستندات الرسمية",
      fields: [
        {
          type: "image",
          name: "taxCertificate",
          label: "شهادة الضريبة",
          helperText: "يجب أن يكون المستند بصيغة PDF",
          required: true,
          imageConfig: {
            allowedFileTypes: ["application/pdf"],
            maxFileSize: 5 * 1024 * 1024, // 5MB
          },
        },
        {
          type: "image",
          name: "chamberOfCommerceCertificate",
          label: "شهادة الغرفة التجارية",
          helperText: "يجب أن يكون المستند بصيغة PDF",
          required: true,
          imageConfig: {
            allowedFileTypes: ["application/pdf"],
            maxFileSize: 5 * 1024 * 1024, // 5MB
          },
        },
        {
          type: "image",
          name: "municipalLicense",
          label: "رخصة البلدية",
          helperText: "يجب أن يكون المستند بصيغة PDF",
          required: true,
          imageConfig: {
            allowedFileTypes: ["application/pdf"],
            maxFileSize: 5 * 1024 * 1024, // 5MB
          },
        },
        {
          type: "image",
          name: "saudizationCertificate",
          label: "شهادة السعودة",
          helperText: "يجب أن يكون المستند بصيغة PDF",
          required: false,
          imageConfig: {
            allowedFileTypes: ["application/pdf"],
            maxFileSize: 5 * 1024 * 1024, // 5MB
          },
        },
      ],
      columns: 2,
    },
  ],
  submitButtonText: "حفظ البيانات",
  cancelButtonText: "الغاء",
  showCancelButton: true,
  showReset: true,
  resetButtonText: "إعادة تعيين",
  onSubmit: async (values) => {
    console.log("Form values:", values);
    
    // In a real application, you would submit the data to an API
    // For now, we'll simulate a successful submission
    return {
      success: true,
      message: "تم حفظ البيانات بنجاح",
    };
  },
};

export default function CompanyOfficialDataPage() {
  return (
    <div className="container mx-auto p-6" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">ابعاد الرؤية للاستشارات الهندسية</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span>تاريخ الانضمام</span>
            <span className="font-bold">04/05/2024</span>
          </div>
        </div>
      </div>

      <div className="w-full mb-8">
        <div className="flex justify-center items-center h-32 w-32 mx-auto bg-opacity-5 bg-white rounded-full border border-gray-300 relative">
          <span className="text-center text-sm text-gray-400">لا يلزم تحميل لوجو الشركة</span>
        </div>
      </div>

      <Tabs defaultValue="official-data" className="w-full mb-6">
        <TabsList className="mb-4 w-full justify-end">
          <TabsTrigger value="branches" className="gap-2">
            <MapPinIcon className="h-4 w-4" />
            الفروع
          </TabsTrigger>
          <TabsTrigger value="official-data" className="gap-2">
            <BuildingIcon className="h-4 w-4" />
            البيانات الرسمية
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="official-data">
          <Card className="bg-[#140F35] border-none shadow-md">
            <CardContent className="pt-6">
              <SheetFormBuilder
                config={companyFormConfig}
                onSuccess={(values) => {
                  console.log("Form submitted successfully:", values);
                  alert("تم حفظ البيانات بنجاح");
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="branches">
          <Card className="bg-[#140F35] border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-pink-500" />
                الفروع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-400">
                لا يوجد بيانات
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Card className="bg-[#140F35] border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-yellow-500" />
              الموظفين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-400">
              لا يوجد بيانات
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 