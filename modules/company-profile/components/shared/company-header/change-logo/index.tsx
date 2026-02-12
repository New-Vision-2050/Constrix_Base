"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import validCompanyProfileImage from "@/modules/company-profile/service/validate-company-image";
import { cn } from "@/lib/utils";
import uploadCompanyImage from "@/modules/company-profile/service/upload-company-image";
import { deleteCookie } from "cookies-next";
import { useParams } from "@i18n/navigation";
import ImageUploadWithCrop from "@/components/shared/image-upload-with-crop";

interface IChangeLogo {
  handleClose: () => void;
}

interface ValidationRule {
  sentence: string;
  sub_title: string | null;
  status: number;
  validate: string;
}

const getInitialRules = (): ValidationRule[] => [
  {
    sentence: "حجم الصورة يجب أن لا يتعدى 5 ميجابايت",
    sub_title: null,
    status: 0,
    validate: "required",
  },
  {
    sentence: "أبعاد الصورة غير صحيحة. يجب أن تكون الأبعاد بين  1920*1080",
    sub_title: null,
    status: 0,
    validate: "required",
  },
  {
    sentence: "تأكد ان الخلفية بيضاء",
    sub_title: null,
    status: 0,
    validate: "required",
  },
];

const ChangeLogo = ({ handleClose }: IChangeLogo) => {
  const { company_id }: { company_id: string | undefined } = useParams();

  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rules, setRules] = useState<ValidationRule[]>(getInitialRules());
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [croppedImageBase64, setCroppedImageBase64] = useState<string | null>(
    null,
  );

  const { mutate: mutateValidation, isPending: isValidationPending } =
    useMutation({
      mutationFn: async (file: File) =>
        await validCompanyProfileImage(file, company_id),
    });

  const { mutate: mutateUpload, isPending: isUploadPending } = useMutation({
    mutationFn: async (file: File) =>
      await uploadCompanyImage(file, company_id),
  });

  useEffect(() => {
    const test = rules.every((rule) => rule.status === 1);
    setValid(test);
  }, [rules]);

  // Handle cropped image from ImageUploadWithCrop
  const handleImageCropped = (file: File | null, base64: string | null) => {
    setUploadedFile(file);
    setCroppedImageBase64(base64);
    // Reset validation when new image is selected
    setValid(false);
    setRules(getInitialRules());
  };

  // Validate image
  const handleValidateImage = async () => {
    if (!uploadedFile) return;

    setLoading(true);
    mutateValidation(uploadedFile, {
      onSuccess: () => {
        setRules((prev) =>
          prev.map((rule) => ({
            ...rule,
            status: 1,
          })),
        );
        setValid(true);
        setLoading(false);
      },
      onError: (err: unknown) => {
        const messageObj = (
          err as { response?: { data?: { message?: Record<string, unknown> } } }
        )?.response?.data?.message;
        const newRule = messageObj
          ? Object.values(messageObj).filter(
              (item) =>
                item !== null &&
                typeof item === "object" &&
                !Array.isArray(item),
            )
          : [];
        setRules(newRule as ValidationRule[]);
        setValid(false);
        setLoading(false);
      },
    });
  };

  // Upload image
  const handleSaveImage = async () => {
    if (!uploadedFile) return;

    setLoading(true);
    mutateUpload(uploadedFile, {
      onSuccess: () => {
        deleteCookie("company-data");
        window.location.reload();
        handleClose();
        setLoading(false);
      },
      onError: () => {
        setLoading(false);
      },
    });
  };

  return (
    <div>
      <div className="mb-10">
        <div className="grid grid-cols-2 items-center gap-8">
          <div className="space-y-3 text-right">
            <ul className="list-decimal pr-5 space-y-2 text-sm">
              {rules.map((rule) => (
                <li key={rule.sentence} className="flex items-center gap-2">
                  <AlertCircle
                    className={cn(
                      "w-4 h-4 shrink-0",
                      Boolean(rule.status)
                        ? "text-green-500"
                        : "text-yellow-400",
                    )}
                  />
                  <p className="text-lg">{rule.sentence}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Image Upload with Crop */}
          <ImageUploadWithCrop
            onChange={handleImageCropped}
            loading={loading || isValidationPending || isUploadPending}
            previewImage={croppedImageBase64}
            disabled={false}
            cropOptions={{
              minWidth: 100,
              aspect: 16 / 9,
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs">
        <Button
          onClick={!valid ? handleValidateImage : handleSaveImage}
          className="w-32"
          loading={loading || isValidationPending || isUploadPending}
          disabled={
            !Boolean(uploadedFile) ||
            loading ||
            isValidationPending ||
            isUploadPending
          }
        >
          {valid ? "حفظ" : "تحقق من الصوره"}
        </Button>
        <Button
          type="button"
          variant={"outline"}
          className="w-32"
          onClick={handleClose}
        >
          الغاء
        </Button>
      </div>
    </div>
  );
};

export default ChangeLogo;
