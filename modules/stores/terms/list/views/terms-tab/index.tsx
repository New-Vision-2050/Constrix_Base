"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import RichTextEditor from "../../../components/RichTextEditor";
import { TermsApi } from "@/services/api/ecommerce/terms";
import { Loader2 } from "lucide-react";

export default function TermsTabView() {
  const t = useTranslations();
  const [content, setContent] = useState("");
  const type = "terms_conditions";

  // const { data: termsData, isLoading } = useQuery({
  //   queryKey: ["terms", type],
  //   queryFn: () => TermsApi.show(type),
  // });

  // useEffect(() => {
  //   if (termsData?.data?.payload?.content) {
  //     setContent(termsData.data.payload.content);
  //   }
  // }, [termsData]);

  const updateMutation = useMutation({
    mutationFn: (content: string) => TermsApi.update(type, { content }),
    onSuccess: () => {
      toast.success(t("terms.updateSuccess") || "تم التحديث بنجاح");
    },
    onError: () => {
      toast.error(t("terms.updateError") || "فشل التحديث");
    },
  });

  const handleSave = () => {
    updateMutation.mutate(content);
  };

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[400px]">
  //       <Loader2 className="h-8 w-8 animate-spin text-primary" />
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">الشروط</h2>
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
        >
          {updateMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {t("terms.save") || "حفظ"}
        </Button>
      </div>

      <RichTextEditor
        value={content}
        onChange={setContent}
        placeholder={t("terms.enterContent") || "أدخل المحتوى هنا..."}
      />
    </div>
  );
}
