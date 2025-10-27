"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import RichTextEditor from "./RichTextEditor";
import { TermsApi } from "@/services/api/ecommerce/terms";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TermsType } from "@/types/api/ecommerce/terms";

interface TermsTabTemplateProps {
  type: TermsType;
  title: string;
}

export default function TermsTabTemplate({
  type,
  title,
}: TermsTabTemplateProps) {
  const t = useTranslations();
  const [contentAr, setContentAr] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [activeTab, setActiveTab] = useState("ar");

  const { data: termsData, isLoading, isFetching } = useQuery({
    queryKey: ["terms", type],
    queryFn: () => TermsApi.show(type),
    staleTime: 0, // Always refetch on tab visit
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnMount: "always", // Always refetch when component mounts
  });

  useEffect(() => {
    if (termsData?.data?.payload?.description) {
      setContentAr(termsData.data.payload.description.ar || "");
      setContentEn(termsData.data.payload.description.en || "");
    }
  }, [termsData]);

  const updateMutation = useMutation({
    mutationFn: (data: { description: { ar: string; en: string } }) =>
      TermsApi.update(type, data),
    onSuccess: () => {
      toast.success(t("terms.updateSuccess") || "تم التحديث بنجاح");
    },
    onError: () => {
      toast.error(t("terms.updateError") || "فشل التحديث");
    },
  });

  const handleSave = () => {
    // Validate that both Arabic and English content are provided
    if (!contentAr.trim()) {
      toast.error("المحتوى العربي مطلوب / Arabic content is required");
      return;
    }
    
    if (!contentEn.trim()) {
      toast.error("المحتوى الإنجليزي مطلوب / English content is required");
      return;
    }

    updateMutation.mutate({ 
      description: { 
        ar: contentAr, 
        en: contentEn 
      } 
    });
  };

  // Show loading spinner only on first visit (when no cached data)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending || isLoading}
          className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
        >
          {updateMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {t("terms.save") || "حفظ"}
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
        dir="rtl"
      >
        <TabsList className="inline-flex gap-8 bg-transparent border-b border-gray-700 w-auto">
          <TabsTrigger 
            value="ar" 
            className="text-sm data-[state=active]:text-pink-500 data-[state=active]:border-b-2 data-[state=active]:border-pink-500 data-[state=inactive]:text-white rounded-none pb-3 bg-transparent"
          >
            اللغة العربية (AR)
          </TabsTrigger>
          <TabsTrigger 
            value="en" 
            className="text-sm data-[state=active]:text-pink-500 data-[state=active]:border-b-2 data-[state=active]:border-pink-500 data-[state=inactive]:text-white rounded-none pb-3 bg-transparent"
          >
            اللغة الإنجليزية (EN)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ar" className="mt-4">
          {isFetching && !isLoading && (
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>جاري تحميل البيانات...</span>
            </div>
          )}
          <RichTextEditor
            value={contentAr}
            onChange={setContentAr}
            placeholder={t("terms.enterContent") || "أدخل المحتوى هنا..."}
          />
        </TabsContent>

        <TabsContent value="en" className="mt-4">
          {isFetching && !isLoading && (
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading data...</span>
            </div>
          )}
          <RichTextEditor
            value={contentEn}
            onChange={setContentEn}
            placeholder={t("terms.enterContent") || "Enter content here..."}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
